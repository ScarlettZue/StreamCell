import { Router } from 'express';
import { WhatsAppController } from '../controllers/whatsappController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const whatsappRouter = Router();

whatsappRouter.post('/generate-reminder', authMiddleware, WhatsAppController.generateReminder);
