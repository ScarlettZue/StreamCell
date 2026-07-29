import { Router } from 'express';
import { SaleController } from '../controllers/saleController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const saleRouter = Router();

saleRouter.use(authMiddleware);

saleRouter.post('/', SaleController.createSale);
saleRouter.get('/', SaleController.getSales);
