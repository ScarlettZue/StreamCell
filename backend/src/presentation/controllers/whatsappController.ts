import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { WhatsAppDomainService } from '../../domain/services/whatsappService';
import { AppError } from '../middlewares/errorHandler';

const whatsappSchema = z.object({
  clientName: z.string().min(1, 'El nombre del cliente es obligatorio'),
  phone: z.string().min(7, 'Número de celular inválido'),
  productName: z.string().min(1, 'El nombre del producto es obligatorio'),
  dueDate: z.string().or(z.date()),
});

export class WhatsAppController {
  public static generateReminder(req: Request, res: Response, next: NextFunction): void {
    try {
      const { clientName, phone, productName, dueDate } = whatsappSchema.parse(req.body);

      const result = WhatsAppDomainService.generateReminder({
        clientName,
        phone,
        productName,
        dueDate,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
