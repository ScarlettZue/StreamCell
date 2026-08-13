import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const productRouter = Router();

productRouter.use(authMiddleware);

// Categorías
productRouter.post('/categories', ProductController.createCategory);
productRouter.get('/categories', ProductController.getCategories);

// Productos
productRouter.post('/products', ProductController.createProduct);
productRouter.get('/products', ProductController.getProducts);
productRouter.put('/products/:id', ProductController.updateProduct);
