import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../../infrastructure/database/prisma';
import { EncryptionService } from '../../infrastructure/security/encryption';
import { AppError } from '../middlewares/errorHandler';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

const profileInputSchema = z.object({
  profileName: z.string().min(1, 'El nombre del perfil es obligatorio'),
  hasPin: z.boolean().default(false),
  pin: z.string().optional(),
  userEmail: z.string().optional(),
  spotifyUsername: z.string().optional(),
  familyAddress: z.string().optional(),
  // Campos opcionales si se marca vendido durante el registro
  isSold: z.boolean().default(false),
  clientId: z.string().optional(),
  serviceStartDate: z.string().or(z.date()).optional(),
  serviceEndDate: z.string().or(z.date()).optional(),
  saleCost: z.number().optional(),
  salePrice: z.number().optional(),
});

const createAccountSchema = z.object({
  productId: z.string().uuid('ID de producto no válido'),
  email: z.string().min(3, 'Correo o identificador de cuenta obligatorio'),
  password: z.string().optional(),
  startDate: z.string().or(z.date()).optional(),
  dueDate: z.string().or(z.date()).optional(),
  notes: z.string().optional(),
  profiles: z.array(profileInputSchema).min(1, 'Debe incluir al menos un perfil o cupo'),
});

export class AccountController {
  public static async createAccount(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new AppError('Usuario no autenticado', 401);

      const body = createAccountSchema.parse(req.body);

      const product = await prisma.product.findUnique({ where: { id: body.productId } });
      if (!product) throw new AppError('El producto no existe', 404);

      // Cifrar la contraseña de la cuenta si existe
      const encryptedAccountPassword = body.password ? EncryptionService.encrypt(body.password) : null;

      // Definir fechas predeterminadas de la cuenta (+30 días por defecto)
      const now = new Date();
      const accountStartDate = body.startDate ? new Date(body.startDate) : now;
      const accountDueDate = body.dueDate ? new Date(body.dueDate) : new Date(accountStartDate.getTime() + 30 * 24 * 60 * 60 * 1000);

      // Ejecutar transacción para crear cuenta, perfiles y ventas asociadas
      const createdAccount = await prisma.$transaction(async (tx) => {
        const account = await tx.account.create({
          data: {
            productId: body.productId,
            email: body.email,
            password: encryptedAccountPassword,
            startDate: accountStartDate,
            dueDate: accountDueDate,
            notes: body.notes,
          },
        });

        for (const p of body.profiles) {
          const encryptedPin = p.pin ? EncryptionService.encrypt(p.pin) : null;
          const status = p.isSold ? 'SOLD' : 'AVAILABLE';

          const createdProfile = await tx.accountProfile.create({
            data: {
              accountId: account.id,
              profileName: p.profileName,
              hasPin: p.hasPin,
              pin: encryptedPin,
              userEmail: p.userEmail,
              spotifyUsername: p.spotifyUsername,
              familyAddress: p.familyAddress,
              status,
            },
          });

          // Si se marcó vendido durante el registro
          if (p.isSold && p.clientId) {
            const client = await tx.client.findUnique({ where: { id: p.clientId } });
            if (!client) throw new AppError(`Cliente con ID ${p.clientId} no existe`, 404);

            const sStartDate = p.serviceStartDate ? new Date(p.serviceStartDate) : now;
            const sEndDate = p.serviceEndDate ? new Date(p.serviceEndDate) : new Date(sStartDate.getTime() + 30 * 24 * 60 * 60 * 1000);

            const unitCost = p.saleCost ?? Number(product.defaultCost);
            const unitPrice = p.salePrice ?? Number(product.defaultPrice);
            const subtotalProfit = unitPrice - unitCost;

            // Crear Suscripción activa
            await tx.profileSubscription.create({
              data: {
                accountProfileId: createdProfile.id,
                clientId: p.clientId,
                serviceStartDate: sStartDate,
                serviceEndDate: sEndDate,
                status: 'ACTIVE',
              },
            });

            // Crear registro de Venta
            const saleCode = `VTA-${Date.now().toString().slice(-6)}`;
            const sale = await tx.sale.create({
              data: {
                code: saleCode,
                clientId: p.clientId,
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
                accountProfileId: createdProfile.id,
                unitCost,
                unitPrice,
                subtotalProfit,
              },
            });
          }
        }

        return account;
      });

      res.status(201).json({
        success: true,
        message: 'Cuenta e inventarios de perfiles registrados con éxito',
        data: createdAccount,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getAllAccounts(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const accounts = await prisma.account.findMany({
        orderBy: { dueDate: 'asc' },
        include: {
          product: true,
          profiles: {
            include: {
              subscriptions: {
                where: { status: 'ACTIVE' },
                include: { client: true },
              },
            },
          },
        },
      });

      // Descifrar claves y PINs para el cliente autenticado
      const decryptedAccounts = accounts.map((acc) => ({
        ...acc,
        password: acc.password ? EncryptionService.decrypt(acc.password) : null,
        profiles: acc.profiles.map((prof) => ({
          ...prof,
          pin: prof.pin ? EncryptionService.decrypt(prof.pin) : null,
        })),
      }));

      res.json({
        success: true,
        data: decryptedAccounts,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getAvailableProfiles(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profiles = await prisma.accountProfile.findMany({
        where: { status: 'AVAILABLE' },
        include: {
          account: {
            include: { product: true },
          },
        },
      });

      const decrypted = profiles.map((p) => ({
        ...p,
        pin: p.pin ? EncryptionService.decrypt(p.pin) : null,
        account: {
          ...p.account,
          password: p.account.password ? EncryptionService.decrypt(p.account.password) : null,
        },
      }));

      res.json({
        success: true,
        data: decrypted,
      });
    } catch (error) {
      next(error);
    }
  }
}
