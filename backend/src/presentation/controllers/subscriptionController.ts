import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../../infrastructure/database/prisma';
import { AppError } from '../middlewares/errorHandler';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

const renewSchema = z.object({
  serviceStartDate: z.string().or(z.date()).optional(),
  serviceEndDate: z.string().or(z.date()).optional(),
  durationDays: z.number().optional(),
  saleCost: z.number().nonnegative('El costo debe ser mayor o igual a 0'),
  salePrice: z.number().positive('El precio debe ser mayor a 0'),
});

const revokeSchema = z.object({
  withDebt: z.boolean().default(false),
  debtAmount: z.number().nonnegative('El monto de deuda debe ser mayor o igual a 0').optional(),
  reason: z.string().optional(),
});

export class SubscriptionController {
  public static async renew(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new AppError('Usuario no autenticado', 401);

      const { id } = req.params;
      const { serviceStartDate, serviceEndDate, durationDays, saleCost, salePrice } = renewSchema.parse(req.body);

      const subscription = await prisma.profileSubscription.findUnique({
        where: { id },
        include: {
          profile: { include: { account: { include: { product: true } } } },
          client: true,
        },
      });

      if (!subscription) throw new AppError('Suscripción no encontrada', 404);

      const daysToAdd = durationDays || 30;
      const sStartDate = serviceStartDate ? new Date(serviceStartDate) : subscription.serviceStartDate;

      let sEndDate: Date;
      if (serviceEndDate) {
        sEndDate = new Date(serviceEndDate);
      } else {
        const baseDate = new Date(subscription.serviceEndDate);
        baseDate.setDate(baseDate.getDate() + daysToAdd);
        sEndDate = baseDate;
      }

      const subtotalProfit = salePrice - saleCost;


      const result = await prisma.$transaction(async (tx) => {
        // Actualizar suscripción
        const updatedSub = await tx.profileSubscription.update({
          where: { id },
          data: {
            serviceStartDate: sStartDate,
            serviceEndDate: sEndDate,
            status: 'ACTIVE',
          },
        });

        // Asegurar que el perfil esté marcado como VENDIDO
        await tx.accountProfile.update({
          where: { id: subscription.accountProfileId },
          data: { status: 'SOLD' },
        });

        // Registrar la Venta por Renovación
        const saleCode = `REN-${Date.now().toString().slice(-6)}`;
        const sale = await tx.sale.create({
          data: {
            code: saleCode,
            clientId: subscription.clientId,
            userId,
            totalAmount: salePrice,
            totalCost: saleCost,
            netProfit: subtotalProfit,
            status: 'COMPLETED',
          },
        });

        await tx.saleDetail.create({
          data: {
            saleId: sale.id,
            accountProfileId: subscription.accountProfileId,
            unitCost: saleCost,
            unitPrice: salePrice,
            subtotalProfit,
          },
        });

        return updatedSub;
      });

      res.json({
        success: true,
        message: 'Servicio renovado con éxito por 30 días adicionales',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async revoke(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { withDebt, debtAmount, reason } = revokeSchema.parse(req.body);

      const subscription = await prisma.profileSubscription.findUnique({
        where: { id },
        include: { client: true, profile: true },
      });

      if (!subscription) throw new AppError('Suscripción no encontrada', 404);

      const newStatus = withDebt ? 'CANCELLED_WITH_DEBT' : 'CANCELLED_NO_DEBT';
      const dAmount = withDebt ? debtAmount ?? 0 : 0;

      await prisma.$transaction(async (tx) => {
        // 1. Actualizar estado de la suscripción
        await tx.profileSubscription.update({
          where: { id },
          data: {
            status: newStatus,
            debtAmount: dAmount,
          },
        });

        // 2. Liberar el perfil en el inventario
        await tx.accountProfile.update({
          where: { id: subscription.accountProfileId },
          data: { status: 'AVAILABLE' },
        });

        // 3. Si es con deuda, registrarla en el cliente
        if (withDebt && dAmount > 0) {
          await tx.debtRecord.create({
            data: {
              clientId: subscription.clientId,
              subscriptionId: subscription.id,
              amount: dAmount,
              reason: reason || 'Retiro de perfil con días pendientes de pago',
              isPaid: false,
            },
          });

          const currentDebt = Number(subscription.client.totalDebt);
          await tx.client.update({
            where: { id: subscription.clientId },
            data: { totalDebt: currentDebt + dAmount },
          });
        }
      });

      res.json({
        success: true,
        message: withDebt
          ? `Perfil retirado. Se ha registrado una deuda de $${dAmount} al cliente.`
          : 'Perfil retirado y liberado en inventario sin deudas.',
      });
    } catch (error) {
      next(error);
    }
  }
}
