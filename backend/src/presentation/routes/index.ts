import { Router, Request, Response } from 'express';
import { authRouter } from './authRoutes';
import { whatsappRouter } from './whatsappRoutes';

export const mainRouter = Router();

// Health check endpoint
mainRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API Streamcell funcionando correctamente',
    timestamp: new Date().toISOString(),
    timezone: 'America/Bogota',
  });
});

// Rutas por dominios
mainRouter.use('/auth', authRouter);
mainRouter.use('/whatsapp', whatsappRouter);
