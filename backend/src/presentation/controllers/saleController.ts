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

  private static async performRecalculation(): Promise<void> {
    // 0. Eliminar ventas de prueba especificadas por el usuario si existen
    const targetCodes = ['VTA-1785979287085-3P6HJ', 'VTA-1785978531179-GZNEA', 'VTA-305279'];
    for (const code of targetCodes) {
      const targetSale = await prisma.sale.findFirst({
        where: { code },
        include: { details: true },
      });
      if (targetSale) {
        for (const detail of targetSale.details) {
          if (detail.accountProfileId) {
            await prisma.accountProfile.update({
              where: { id: detail.accountProfileId },
              data: { status: 'AVAILABLE' },
            });
            await prisma.profileSubscription.deleteMany({
              where: {
                clientId: targetSale.clientId,
                accountProfileId: detail.accountProfileId,
              },
            });
          }
        }
        await prisma.saleDetail.deleteMany({ where: { saleId: targetSale.id } });
        await prisma.sale.delete({ where: { id: targetSale.id } });
      }
    }

    const sales = await prisma.sale.findMany({
      include: {
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

    for (const sale of sales) {
      let newTotalCost = 0;
      let newTotalAmount = 0;
      let hasChanges = false;

      for (const detail of sale.details) {
        const product = detail.profile?.account?.product;
        if (product) {
          const profilesCount = Math.max(1, product.profilesCount || 1);
          const proportionalCost = Math.round(Number(product.defaultCost) / profilesCount);

          const currentUnitCost = Number(detail.unitCost);
          const currentUnitPrice = Number(detail.unitPrice);

          if (profilesCount > 1 && Math.abs(currentUnitCost - Number(product.defaultCost)) < 1) {
            const newSubtotalProfit = currentUnitPrice - proportionalCost;

            await prisma.saleDetail.update({
              where: { id: detail.id },
              data: {
                unitCost: proportionalCost,
                subtotalProfit: newSubtotalProfit,
              },
            });

            newTotalCost += proportionalCost;
            hasChanges = true;
          } else {
            newTotalCost += currentUnitCost;
          }
          newTotalAmount += currentUnitPrice;
        } else {
          newTotalCost += Number(detail.unitCost);
          newTotalAmount += Number(detail.unitPrice);
        }
      }

      if (hasChanges) {
        const newNetProfit = newTotalAmount - newTotalCost;
        await prisma.sale.update({
          where: { id: sale.id },
          data: {
            totalCost: newTotalCost,
            netProfit: newNetProfit,
          },
        });
      }
    }
  }

  public static async recalculateSalesProfits(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await SaleController.performRecalculation();
      res.json({
        success: true,
        message: 'Se recalcularon y corrigieron las ventas pasadas con éxito',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateSale(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { unitCost, unitPrice, createdAt } = req.body;

      const sale = await prisma.sale.findUnique({
        where: { id },
        include: { details: true },
      });

      if (!sale) throw new AppError('Venta no encontrada', 404);

      await prisma.$transaction(async (tx) => {
        let newTotalCost = Number(sale.totalCost);
        let newTotalAmount = Number(sale.totalAmount);

        if (sale.details.length > 0) {
          const detail = sale.details[0];
          const newCost = unitCost !== undefined ? Number(unitCost) : Number(detail.unitCost);
          const newPrice = unitPrice !== undefined ? Number(unitPrice) : Number(detail.unitPrice);
          const newSubtotalProfit = newPrice - newCost;

          await tx.saleDetail.update({
            where: { id: detail.id },
            data: {
              unitCost: newCost,
              unitPrice: newPrice,
              subtotalProfit: newSubtotalProfit,
            },
          });

          newTotalCost = newCost;
          newTotalAmount = newPrice;
        }

        const newNetProfit = newTotalAmount - newTotalCost;
        const updateData: any = {
          totalCost: newTotalCost,
          totalAmount: newTotalAmount,
          netProfit: newNetProfit,
        };

        if (createdAt) {
          updateData.createdAt = new Date(createdAt);
        }

        await tx.sale.update({
          where: { id },
          data: updateData,
        });
      });

      res.json({
        success: true,
        message: 'Venta actualizada con éxito',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteSale(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const sale = await prisma.sale.findUnique({
        where: { id },
        include: { details: true },
      });

      if (!sale) throw new AppError('Venta no encontrada', 404);

      await prisma.$transaction(async (tx) => {
        for (const detail of sale.details) {
          if (detail.accountProfileId) {
            // Liberar perfil si aplica
            const activeSubs = await tx.profileSubscription.count({
              where: { accountProfileId: detail.accountProfileId, status: 'ACTIVE' },
            });
            if (activeSubs <= 1) {
              await tx.accountProfile.update({
                where: { id: detail.accountProfileId },
                data: { status: 'AVAILABLE' },
              });
            }
          }
        }
        await tx.saleDetail.deleteMany({ where: { saleId: id } });
        await tx.sale.delete({ where: { id } });
      });

      res.json({
        success: true,
        message: 'Venta eliminada con éxito',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getCashFlowStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sales = await prisma.sale.findMany({
        orderBy: { createdAt: 'desc' },
      });

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      // Métricas del Mes Actual
      const monthSales = sales.filter((s) => {
        const d = new Date(s.createdAt);
        return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      });

      const monthRevenue = monthSales.reduce((acc, s) => acc + Number(s.totalAmount), 0);
      const monthProfit = monthSales.reduce((acc, s) => acc + Number(s.netProfit), 0);
      const monthCost = monthSales.reduce((acc, s) => acc + Number(s.totalCost), 0);

      // Métricas de Hoy
      const todaySales = sales.filter((s) => {
        const d = new Date(s.createdAt);
        return (
          d.getFullYear() === currentYear &&
          d.getMonth() === currentMonth &&
          d.getDate() === now.getDate()
        );
      });

      const todayRevenue = todaySales.reduce((acc, s) => acc + Number(s.totalAmount), 0);
      const todayProfit = todaySales.reduce((acc, s) => acc + Number(s.netProfit), 0);

      // Agrupar ventas por Mes para comparativas
      const monthlyMap = new Map<string, { year: number; month: number; label: string; revenue: number; profit: number; count: number }>();

      const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

      for (const s of sales) {
        const d = new Date(s.createdAt);
        const y = d.getFullYear();
        const m = d.getMonth();
        const key = `${y}-${String(m + 1).padStart(2, '0')}`;
        const label = `${monthNames[m]} ${y}`;

        if (!monthlyMap.has(key)) {
          monthlyMap.set(key, { year: y, month: m, label, revenue: 0, profit: 0, count: 0 });
        }
        const entry = monthlyMap.get(key)!;
        entry.revenue += Number(s.totalAmount);
        entry.profit += Number(s.netProfit);
        entry.count += 1;
      }

      const monthlyHistory = Array.from(monthlyMap.values()).sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
      });

      // Cálculo de variación % con el mes anterior si existe
      let growthRevenuePercent = 0;
      let growthProfitPercent = 0;

      if (monthlyHistory.length >= 2) {
        const curr = monthlyHistory[0];
        const prev = monthlyHistory[1];
        if (prev.revenue > 0) {
          growthRevenuePercent = Math.round(((curr.revenue - prev.revenue) / prev.revenue) * 100);
        }
        if (prev.profit > 0) {
          growthProfitPercent = Math.round(((curr.profit - prev.profit) / prev.profit) * 100);
        }
      }

      res.json({
        success: true,
        data: {
          currentMonth: {
            revenue: monthRevenue,
            profit: monthProfit,
            cost: monthCost,
            count: monthSales.length,
          },
          today: {
            revenue: todayRevenue,
            profit: todayProfit,
            count: todaySales.length,
          },
          growth: {
            revenuePercent: growthRevenuePercent,
            profitPercent: growthProfitPercent,
          },
          monthlyHistory,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getSales(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await SaleController.performRecalculation();

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
