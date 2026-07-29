import { api } from './api';
import { ApiResponse, ISale } from '../types';

export const saleService = {
  async getSales(): Promise<{ sales: ISale[]; metrics: { totalSalesCount: number; totalRevenue: number; totalProfit: number } }> {
    const res = await api.get<ApiResponse<ISale[]>>('/sales');
    return {
      sales: res.data.data,
      metrics: res.data.metrics || { totalSalesCount: 0, totalRevenue: 0, totalProfit: 0 },
    };
  },

  async createSale(data: {
    clientId: string;
    accountProfileId: string;
    unitCost: number;
    unitPrice: number;
    serviceStartDate?: string;
    serviceEndDate?: string;
  }): Promise<ISale> {
    const res = await api.post<ApiResponse<ISale>>('/sales', data);
    return res.data.data;
  },
};
