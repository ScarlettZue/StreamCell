import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { mainRouter } from './presentation/routes';
import { errorHandler } from './presentation/middlewares/errorHandler';

dotenv.config();

const app: Application = express();

// Middlewares globales
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de API REST
app.use('/api/v1', mainRouter);

// Middleware global de manejo de errores
app.use(errorHandler);

export default app;
