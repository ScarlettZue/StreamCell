import { Router } from 'express';
import { AccountController } from '../controllers/accountController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const accountRouter = Router();

accountRouter.use(authMiddleware);

accountRouter.post('/', AccountController.createAccount);
accountRouter.get('/', AccountController.getAllAccounts);
accountRouter.get('/profiles/available', AccountController.getAvailableProfiles);
accountRouter.put('/:id', AccountController.updateAccount);
accountRouter.delete('/:id', AccountController.deleteAccount);
