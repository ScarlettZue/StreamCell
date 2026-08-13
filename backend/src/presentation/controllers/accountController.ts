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

const parseDateNoonUTC = (dateInput?: string | Date): Date => {
  if (!dateInput) return new Date();
  if (typeof dateInput === 'string') {
    const match = dateInput.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const [, y, m, d] = match;
      return new Date(Date.UTC(Number(y), Number(m) - 1, Number(d), 12, 0, 0));
    }
  }
  const d = new Date(dateInput);
  return isNaN(d.getTime()) ? new Date() : d;
};

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
      const accountStartDate = body.startDate ? parseDateNoonUTC(body.startDate) : new Date();
      const accountDueDate = body.dueDate ? parseDateNoonUTC(body.dueDate) : new Date(accountStartDate.getTime() + 30 * 24 * 60 * 60 * 1000);

      // Ejecutar transacción para crear cuenta, perfiles y ventas asociadas
      const createdAccount = await prisma.$transaction(
        async (tx) => {
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

            const sStartDate = p.serviceStartDate ? new Date(p.serviceStartDate) : new Date();
            const sEndDate = p.serviceEndDate ? new Date(p.serviceEndDate) : new Date(sStartDate.getTime() + 30 * 24 * 60 * 60 * 1000);

            const totalProfilesCount = Math.max(1, body.profiles.length || product.profilesCount || 1);
            const defaultProfileUnitCost = Number(product.defaultCost) / totalProfilesCount;
            const unitCost = p.saleCost ?? defaultProfileUnitCost;
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
      }, { maxWait: 10000, timeout: 30000 });

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

  public static async updateAccount(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { email, password, startDate, dueDate, notes, profiles } = req.body;

      const existing = await prisma.account.findUnique({
        where: { id },
        include: { product: true },
      });
      if (!existing) {
        throw new AppError('El servicio o cuenta no existe', 404);
      }

      const encryptedPassword = password !== undefined ? (password ? EncryptionService.encrypt(password) : null) : undefined;

      await prisma.$transaction(
        async (tx) => {
        await tx.account.update({
          where: { id },
          data: {
            ...(email && { email }),
            ...(encryptedPassword !== undefined && { password: encryptedPassword }),
            ...(startDate && { startDate: parseDateNoonUTC(startDate) }),
            ...(dueDate && { dueDate: parseDateNoonUTC(dueDate) }),
            ...(notes !== undefined && { notes }),
          },
        });

        if (Array.isArray(profiles)) {
          for (let i = 0; i < profiles.length; i++) {
            const p = profiles[i];
            const hasPinBool = Boolean(p.hasPin);
            const pinVal = hasPinBool && p.pin ? p.pin.trim() : null;
            const encryptedPin = pinVal ? EncryptionService.encrypt(pinVal) : null;
            let targetProfileId = p.id;

            const activeSubCount = targetProfileId
              ? await tx.profileSubscription.count({
                  where: { accountProfileId: targetProfileId, status: 'ACTIVE' },
                })
              : 0;

            const status = (p.isSold !== undefined ? p.isSold : activeSubCount > 0)
              ? 'SOLD'
              : 'AVAILABLE';

            if (targetProfileId) {
              await tx.accountProfile.update({
                where: { id: targetProfileId },
                data: {
                  ...(p.profileName && { profileName: p.profileName }),
                  hasPin: hasPinBool,
                  pin: encryptedPin,
                  status,
                },
              });
            } else {
              // Perfil nuevo creado al editar el servicio
              const createdProfile = await tx.accountProfile.create({
                data: {
                  accountId: id,
                  profileName: p.profileName || `Perfil #${i + 1}`,
                  hasPin: hasPinBool,
                  pin: encryptedPin,
                  status,
                },
              });
              targetProfileId = createdProfile.id;
            }

            if (p.isSold && p.clientId) {
              // Cancel active subs for other clients on this profile
              await tx.profileSubscription.updateMany({
                where: { accountProfileId: targetProfileId, status: 'ACTIVE', clientId: { not: p.clientId } },
                data: { status: 'CANCELLED_NO_DEBT' },
              });

              const existingSub = await tx.profileSubscription.findFirst({
                where: { accountProfileId: targetProfileId, clientId: p.clientId, status: 'ACTIVE' },
              });

              if (!existingSub) {
                const sStartDate = new Date();
                const sEndDate = new Date(sStartDate.getTime() + 30 * 24 * 60 * 60 * 1000);
                const totalProfilesCount = Math.max(1, existing.product.profilesCount || 1);
                const unitCost = Number(existing.product.defaultCost) / totalProfilesCount;
                const unitPrice = Number(existing.product.defaultPrice);

                await tx.profileSubscription.create({
                  data: {
                    accountProfileId: targetProfileId,
                    clientId: p.clientId,
                    serviceStartDate: sStartDate,
                    serviceEndDate: sEndDate,
                    status: 'ACTIVE',
                    debtAmount: unitPrice,
                  },
                });

                let targetUserId = req.user?.userId;
                if (!targetUserId) {
                  const fallbackUser = await tx.user.findFirst();
                  targetUserId = fallbackUser?.id;
                }

                if (targetUserId) {
                  const saleCode = `VTA-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

                  const sale = await tx.sale.create({
                    data: {
                      code: saleCode,
                      clientId: p.clientId,
                      userId: targetUserId,
                      totalAmount: unitPrice,
                      totalCost: unitCost,
                      netProfit: unitPrice - unitCost,
                      status: 'COMPLETED',
                    },
                  });

                  await tx.saleDetail.create({
                    data: {
                      saleId: sale.id,
                      accountProfileId: targetProfileId,
                      unitCost,
                      unitPrice,
                      subtotalProfit: unitPrice - unitCost,
                    },
                  });
                }
              }
            } else if (p.isSold === false) {
              // Solo cancelar suscripciones activas si se especifica explícitamente isSold === false
              await tx.profileSubscription.updateMany({
                where: { accountProfileId: targetProfileId, status: 'ACTIVE' },
                data: { status: 'CANCELLED_NO_DEBT' },
              });
            }
          }
        }
      }, { maxWait: 10000, timeout: 30000 });

      const updatedAccount = await prisma.account.findUnique({
        where: { id },
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

      const decrypted = updatedAccount
        ? {
            ...updatedAccount,
            password: updatedAccount.password ? EncryptionService.decrypt(updatedAccount.password) : null,
            profiles: updatedAccount.profiles.map((prof) => ({
              ...prof,
              pin: prof.pin ? EncryptionService.decrypt(prof.pin) : null,
            })),
          }
        : null;

      res.json({
        success: true,
        message: 'Servicio actualizado exitosamente',
        data: decrypted,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteAccount(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const existing = await prisma.account.findUnique({ where: { id } });
      if (!existing) {
        throw new AppError('El servicio o cuenta no existe', 404);
      }

      await prisma.$transaction(
        async (tx) => {
        const profiles = await tx.accountProfile.findMany({ where: { accountId: id } });
        const profileIds = profiles.map((p) => p.id);

        if (profileIds.length > 0) {
          await tx.profileSubscription.deleteMany({
            where: { accountProfileId: { in: profileIds } },
          });
          await tx.saleDetail.deleteMany({
            where: { accountProfileId: { in: profileIds } },
          });
          await tx.accountProfile.deleteMany({
            where: { accountId: id },
          });
        }

        await tx.account.delete({ where: { id } });
      }, { maxWait: 10000, timeout: 30000 });

      res.json({
        success: true,
        message: 'Servicio eliminado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }
}
