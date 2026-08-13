import { Router } from 'express';
import { SaleController } from '../controllers/saleController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const saleRouter = Router();

saleRouter.use(authMiddleware);

saleRouter.post('/', SaleController.createSale);
saleRouter.get('/', SaleController.getSales);
saleRouter.get('/cash-flow-stats', SaleController.getCashFlowStats);
saleRouter.put('/:id', SaleController.updateSale);
saleRouter.delete('/:id', SaleController.deleteSale);
saleRouter.post('/recalculate', SaleController.recalculateSalesProfits);
saleRouter.get('/recalculate', SaleController.recalculateSalesProfits);
