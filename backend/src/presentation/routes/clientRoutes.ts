import { Router } from 'express';
import { ClientController } from '../controllers/clientController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const clientRouter = Router();

clientRouter.use(authMiddleware);

clientRouter.post('/', ClientController.create);
clientRouter.get('/', ClientController.getAll);
clientRouter.get('/:id', ClientController.getById);
clientRouter.put('/:id', ClientController.update);
clientRouter.delete('/:id', ClientController.delete);
clientRouter.post('/:id/pay-debt', ClientController.payDebt);
