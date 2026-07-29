import { Router } from 'express';
import { AuthController } from '../controllers/authController';

export const authRouter = Router();

authRouter.post('/login', AuthController.login);
authRouter.post('/seed-admin', AuthController.seedAdmin);
