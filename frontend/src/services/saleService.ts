import { api } from './api';
import { ApiResponse, ISale } from '../types';

export interface ICashFlowStats {
  currentMonth: {
    revenue: number;
    profit: number;
    cost: number;
    count: number;
  };
  today: {
    revenue: number;
    profit: number;
    count: number;
  };
  growth: {
    revenuePercent: number;
    profitPercent: number;
  };
  monthlyHistory: Array<{
    year: number;
    month: number;
    label: string;
    revenue: number;
    profit: number;
    count: number;
  }>;
}

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

  async updateSale(id: string, data: { unitCost?: number; unitPrice?: number; createdAt?: string }): Promise<void> {
    await api.put(`/sales/${id}`, data);
  },

  async deleteSale(id: string): Promise<void> {
    await api.delete(`/sales/${id}`);
  },

  async getCashFlowStats(): Promise<ICashFlowStats> {
    const res = await api.get<ApiResponse<ICashFlowStats>>('/sales/cash-flow-stats');
    return res.data.data;
  },
};
