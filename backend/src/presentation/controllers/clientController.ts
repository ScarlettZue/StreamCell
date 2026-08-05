import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../../infrastructure/database/prisma';
import { AppError } from '../middlewares/errorHandler';
import { WhatsAppDomainService } from '../../domain/services/whatsappService';

const createClientSchema = z.object({
  name: z.string().min(2, 'El nombre debe ser válido'),
  phone: z.string().min(7, 'Número de celular inválido'),
  role: z.enum(['CLIENTE', 'DISTRIBUIDOR']).optional().default('CLIENTE'),
  distributorId: z.string().nullable().optional(),
});

const updateClientSchema = z.object({
  name: z.string().min(2, 'El nombre debe ser válido').optional(),
  phone: z.string().optional(),
  role: z.enum(['CLIENTE', 'DISTRIBUIDOR']).optional(),
  distributorId: z.string().nullable().optional(),
});

const payDebtSchema = z.object({
  amountPaid: z.number().positive('El monto a pagar debe ser mayor a 0'),
  notes: z.string().optional(),
});

export class ClientController {
  private static async generateClientKey(): Promise<string> {
    const count = await prisma.client.count();
    const nextNum = (count + 1).toString().padStart(4, '0');
    return `CLI-${nextNum}`;
  }

  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, phone, role, distributorId } = createClientSchema.parse(req.body);
      const normalizedPhone = WhatsAppDomainService.normalizePhone(phone);
      const finalDistributorId = distributorId && distributorId.trim() !== '' ? distributorId : null;

      const clientKey = await ClientController.generateClientKey();

      const client = await prisma.client.create({
        data: {
          clientKey,
          name,
          phone: normalizedPhone,
          role,
          distributorId: finalDistributorId,
        },
        include: {
          distributor: {
            select: { id: true, name: true, phone: true },
          },
          _count: {
            select: { subscriptions: true, sales: true, subClients: true },
          },
        },
      });

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, role } = req.query;

      const whereClause: any = {};
      if (search && typeof search === 'string') {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
          { clientKey: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (role && typeof role === 'string' && (role === 'CLIENTE' || role === 'DISTRIBUIDOR')) {
        whereClause.role = role;
      }

      const clients = await prisma.client.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        include: {
          distributor: {
            select: { id: true, name: true, phone: true },
          },
          _count: {
            select: { subscriptions: true, sales: true, subClients: true },
          },
        },
      });

      res.json({
        success: true,
        data: clients,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const client = await prisma.client.findUnique({
        where: { id },
        include: {
          distributor: {
            select: { id: true, name: true, phone: true },
          },
          subClients: {
            include: {
              subscriptions: true,
            },
            orderBy: { name: 'asc' },
          },
          subscriptions: {
            include: {
              profile: {
                include: {
                  account: {
                    include: { product: true },
                  },
                },
              },
            },
            orderBy: { serviceEndDate: 'desc' },
          },
          debts: {
            orderBy: { createdAt: 'desc' },
          },
          sales: {
            orderBy: { createdAt: 'desc' },
            include: {
              details: {
                include: {
                  profile: {
                    include: {
                      account: {
                        include: { product: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!client) {
        throw new AppError('Usuario no encontrado', 404);
      }

      res.json({
        success: true,
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data = updateClientSchema.parse(req.body);

      if (data.distributorId && data.distributorId === id) {
        throw new AppError('Un usuario no puede ser asignado como su propio distribuidor', 400);
      }

      const updateData: any = { ...data };

      if (data.phone && data.phone.trim().length > 0) {
        updateData.phone = WhatsAppDomainService.normalizePhone(data.phone);
      }

      if (updateData.distributorId !== undefined) {
        updateData.distributorId = updateData.distributorId && updateData.distributorId.trim() !== '' ? updateData.distributorId : null;
      }

      const client = await prisma.client.update({
        where: { id },
        data: updateData,
        include: {
          distributor: {
            select: { id: true, name: true, phone: true },
          },
          _count: {
            select: { subscriptions: true, sales: true, subClients: true },
          },
        },
      });

      res.json({
        success: true,
        message: 'Usuario actualizado exitosamente',
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      await prisma.client.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Cliente eliminado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async payDebt(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { amountPaid, notes } = payDebtSchema.parse(req.body);

      const client = await prisma.client.findUnique({ where: { id } });
      if (!client) {
        throw new AppError('Cliente no encontrado', 404);
      }

      const currentDebt = Number(client.totalDebt);
      if (currentDebt <= 0) {
        throw new AppError('El cliente no posee saldo deudor pendiente', 400);
      }

      const newDebt = Math.max(0, currentDebt - amountPaid);

      const updatedClient = await prisma.$transaction(async (tx) => {
        await tx.debtRecord.updateMany({
          where: { clientId: id, isPaid: false },
          data: { isPaid: true },
        });

        return tx.client.update({
          where: { id },
          data: { totalDebt: newDebt },
        });
      });

      res.json({
        success: true,
        message: `Abono de $${amountPaid} registrado. Saldo deudor actual: $${newDebt}`,
        data: updatedClient,
      });
    } catch (error) {
      next(error);
    }
  }
}
