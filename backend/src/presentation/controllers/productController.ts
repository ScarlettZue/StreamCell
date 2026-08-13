import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../../infrastructure/database/prisma';
import { AppError } from '../middlewares/errorHandler';

const createCategorySchema = z.object({
  name: z.string().min(2, 'El nombre de la categoría es obligatorio'),
  description: z.string().optional(),
});

const createProductSchema = z.object({
  name: z.string().min(2, 'El nombre del producto es obligatorio'),
  categoryId: z.string().uuid('ID de categoría no válido'),
  productCategory: z.enum(['STREAMING', 'SOFTWARE', 'IA']).default('STREAMING'),
  type: z.enum(['MULTI_PROFILE', 'FULL_ACCOUNT', 'PERSONAL_INVITATION']).default('MULTI_PROFILE'),
  defaultCost: z.number().nonnegative('El costo debe ser mayor o igual a 0'),
  defaultPrice: z.number().positive('El precio de venta debe ser mayor a 0'),
  fullAccountPrice: z.number().optional(),
  profilesCount: z.number().int().min(1, 'Debe tener al menos 1 perfil').default(1),
});

export class ProductController {
  // ----------------------------------------
  // CATEGORÍAS
  // ----------------------------------------
  public static async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, description } = createCategorySchema.parse(req.body);

      const existing = await prisma.category.findUnique({ where: { name } });
      if (existing) {
        throw new AppError('La categoría ya existe', 400);
      }

      const category = await prisma.category.create({
        data: { name, description },
      });

      res.status(201).json({
        success: true,
        message: 'Categoría creada exitosamente',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { products: true } },
        },
      });

      res.json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  // ----------------------------------------
  // PRODUCTOS
  // ----------------------------------------
  public static async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, categoryId, productCategory, type, defaultCost, defaultPrice, fullAccountPrice, profilesCount } = createProductSchema.parse(req.body);

      const category = await prisma.category.findUnique({ where: { id: categoryId } });
      if (!category) {
        throw new AppError('La categoría especificada no existe', 404);
      }

      const product = await prisma.product.create({
        data: {
          name,
          categoryId,
          productCategory,
          type,
          defaultCost,
          defaultPrice,
          fullAccountPrice,
          profilesCount,
        },
        include: { category: true },
      });

      res.status(201).json({
        success: true,
        message: 'Producto registrado exitosamente en el catálogo',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getProducts(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const products = await prisma.product.findMany({
        orderBy: { name: 'asc' },
        include: {
          category: true,
          _count: { select: { accounts: true } },
        },
      });

      res.json({
        success: true,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { name, categoryId, productCategory, type, defaultCost, defaultPrice, fullAccountPrice, profilesCount, isActive } = req.body;

      const existing = await prisma.product.findUnique({ where: { id } });
      if (!existing) {
        throw new AppError('La plataforma o producto especificado no existe', 404);
      }

      const updatedProduct = await prisma.product.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(categoryId && { categoryId }),
          ...(productCategory && { productCategory }),
          ...(type && { type }),
          ...(defaultCost !== undefined && { defaultCost }),
          ...(defaultPrice !== undefined && { defaultPrice }),
          ...(fullAccountPrice !== undefined && { fullAccountPrice }),
          ...(profilesCount !== undefined && { profilesCount }),
          ...(isActive !== undefined && { isActive }),
        },
        include: { category: true },
      });

      res.json({
        success: true,
        message: 'Plataforma actualizada exitosamente',
        data: updatedProduct,
      });
    } catch (error) {
      next(error);
    }
  }
}
