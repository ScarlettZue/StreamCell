import { api } from './api';
import { ApiResponse, IProfileSubscription } from '../types';

export const subscriptionService = {
  async renewSubscription(data: {
    subscriptionId: string;
    saleCost: number;
    salePrice: number;
    serviceStartDate?: string;
    serviceEndDate?: string;
  }): Promise<IProfileSubscription> {
    const res = await api.post<ApiResponse<IProfileSubscription>>(`/subscriptions/${data.subscriptionId}/renew`, {
      saleCost: data.saleCost,
      salePrice: data.salePrice,
      serviceStartDate: data.serviceStartDate,
      serviceEndDate: data.serviceEndDate,
    });
    return res.data.data;
  },

  async revokeSubscription(data: {
    subscriptionId: string;
    withDebt: boolean;
    debtAmount?: number;
    reason?: string;
  }): Promise<{ message: string }> {
    const res = await api.post<ApiResponse<null>>(`/subscriptions/${data.subscriptionId}/revoke`, {
      withDebt: data.withDebt,
      debtAmount: data.debtAmount,
      reason: data.reason,
    });
    return { message: res.data.message || 'Suscripción revocada con éxito' };
  },
};
