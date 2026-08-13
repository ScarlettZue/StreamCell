import { Router, Request, Response } from 'express';
import { authRouter } from './authRoutes';
import { clientRouter } from './clientRoutes';
import { productRouter } from './productRoutes';
import { accountRouter } from './accountRoutes';
import { subscriptionRouter } from './subscriptionRoutes';
import { saleRouter } from './saleRoutes';
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

// Rutas de API por dominios
mainRouter.use('/auth', authRouter);
mainRouter.use('/clients', clientRouter);
mainRouter.use('/products', productRouter);
mainRouter.use('/accounts', accountRouter);
mainRouter.use('/subscriptions', subscriptionRouter);
mainRouter.use('/sales', saleRouter);
mainRouter.use('/whatsapp', whatsappRouter);
