import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Error de validación en los datos enviados',
      errors: err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
    });
    return;
  }

  console.error('[Error Global No Controlado]:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
  });
};
