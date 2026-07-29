import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../../infrastructure/database/prisma';
import { HashService } from '../../infrastructure/security/hash';
import { JwtService } from '../../infrastructure/security/jwt';
import { AppError } from '../middlewares/errorHandler';

const loginSchema = z.object({
  email: z.string().email('Correo electrónico no válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const seedAdminSchema = z.object({
  email: z.string().email('Correo electrónico no válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  name: z.string().min(2, 'El nombre debe ser válido'),
});

export class AuthController {
  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new AppError('Credenciales incorrectas', 401);
      }

      const isPasswordValid = await HashService.compare(password, user.password);
      if (!isPasswordValid) {
        throw new AppError('Credenciales incorrectas', 401);
      }

      const token = JwtService.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      res.json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async seedAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, name } = seedAdminSchema.parse(req.body);

      const existingUser = await prisma.user.findFirst();
      if (existingUser) {
        throw new AppError('Ya existe un usuario Administrador registrado', 400);
      }

      const hashedPassword = await HashService.hash(password);
      const admin = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: 'ADMIN',
        },
      });

      res.status(201).json({
        success: true,
        message: 'Administradora inicial registrada con éxito',
        data: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
