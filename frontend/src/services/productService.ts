import { api } from './api';
import { ApiResponse, ICategory, IProduct, ProductType } from '../types';

export const productService = {
  async getCategories(): Promise<ICategory[]> {
    const res = await api.get<ApiResponse<ICategory[]>>('/products/categories');
    return res.data.data;
  },

  async createCategory(name: string, description?: string): Promise<ICategory> {
    const res = await api.post<ApiResponse<ICategory>>('/products/categories', { name, description });
    return res.data.data;
  },

  async getProducts(): Promise<IProduct[]> {
    const res = await api.get<ApiResponse<IProduct[]>>('/products/products');
    return res.data.data;
  },

  async createProduct(data: {
    name: string;
    categoryId: string;
    type: ProductType;
    defaultCost: number;
    defaultPrice: number;
    profilesCount: number;
  }): Promise<IProduct> {
    const res = await api.post<ApiResponse<IProduct>>('/products/products', data);
    return res.data.data;
  },
};
