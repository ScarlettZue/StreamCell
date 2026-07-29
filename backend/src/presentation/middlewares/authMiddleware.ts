import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../../infrastructure/security/jwt';
import { AppError } from './errorHandler';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('No autorizado: Token de sesión faltante', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = JwtService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    throw new AppError('No autorizado: Token inválido o expirado', 401);
  }
};
