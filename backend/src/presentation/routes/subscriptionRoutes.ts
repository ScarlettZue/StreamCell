import { Router } from 'express';
import { SubscriptionController } from '../controllers/subscriptionController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const subscriptionRouter = Router();

subscriptionRouter.use(authMiddleware);

subscriptionRouter.post('/:id/renew', SubscriptionController.renew);
subscriptionRouter.post('/:id/revoke', SubscriptionController.revoke);
