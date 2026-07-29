import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../../infrastructure/database/prisma';
import { AppError } from '../middlewares/errorHandler';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

const createSaleSchema = z.object({
  clientId: z.string().uuid('ID de cliente no válido'),
  accountProfileId: z.string().uuid('ID de perfil no válido'),
  unitCost: z.number().nonnegative('El costo debe ser mayor o igual a 0'),
  unitPrice: z.number().positive('El precio de venta debe ser mayor a 0'),
  serviceStartDate: z.string().or(z.date()).optional(),
  serviceEndDate: z.string().or(z.date()).optional(),
});

export class SaleController {
  public static async createSale(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new AppError('Usuario no autenticado', 401);

      const { clientId, accountProfileId, unitCost, unitPrice, serviceStartDate, serviceEndDate } = createSaleSchema.parse(req.body);

      const profile = await prisma.accountProfile.findUnique({
        where: { id: accountProfileId },
        include: { account: { include: { product: true } } },
      });

      if (!profile) throw new AppError('El perfil seleccionado no existe', 404);
      if (profile.status === 'SOLD') throw new AppError('El perfil seleccionado ya se encuentra vendido', 400);

      const client = await prisma.client.findUnique({ where: { id: clientId } });
      if (!client) throw new AppError('El cliente no existe', 404);

      const now = new Date();
      const sStartDate = serviceStartDate ? new Date(serviceStartDate) : now;
      const sEndDate = serviceEndDate ? new Date(serviceEndDate) : new Date(sStartDate.getTime() + 30 * 24 * 60 * 60 * 1000);

      const subtotalProfit = unitPrice - unitCost;

      const saleResult = await prisma.$transaction(async (tx) => {
        // 1. Marcar perfil como VENDIDO
        await tx.accountProfile.update({
          where: { id: accountProfileId },
          data: { status: 'SOLD' },
        });

        // 2. Crear Suscripción activa para el cliente
        await tx.profileSubscription.create({
          data: {
            accountProfileId,
            clientId,
            serviceStartDate: sStartDate,
            serviceEndDate: sEndDate,
            status: 'ACTIVE',
          },
        });

        // 3. Crear Venta y Detalle con precio dinámico
        const saleCode = `VTA-${Date.now().toString().slice(-6)}`;
        const sale = await tx.sale.create({
          data: {
            code: saleCode,
            clientId,
            userId,
            totalAmount: unitPrice,
            totalCost: unitCost,
            netProfit: subtotalProfit,
            status: 'COMPLETED',
          },
        });

        await tx.saleDetail.create({
          data: {
            saleId: sale.id,
            accountProfileId,
            unitCost,
            unitPrice,
            subtotalProfit,
          },
        });

        return sale;
      });

      res.status(201).json({
        success: true,
        message: 'Venta registrada con éxito',
        data: saleResult,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getSales(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sales = await prisma.sale.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          client: true,
          details: {
            include: {
              profile: {
                include: {
                  account: { include: { product: true } },
                },
              },
            },
          },
        },
      });

      // Métricas acumuladas
      const totalRevenue = sales.reduce((acc, s) => acc + Number(s.totalAmount), 0);
      const totalProfit = sales.reduce((acc, s) => acc + Number(s.netProfit), 0);

      res.json({
        success: true,
        metrics: {
          totalSalesCount: sales.length,
          totalRevenue,
          totalProfit,
        },
        data: sales,
      });
    } catch (error) {
      next(error);
    }
  }
}
