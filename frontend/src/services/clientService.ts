import { api } from './api';
import { ApiResponse, IClient } from '../types';

export const clientService = {
  async getClients(search?: string): Promise<IClient[]> {
    const params = search ? { search } : {};
    const res = await api.get<ApiResponse<IClient[]>>('/clients', { params });
    return res.data.data;
  },

  async getClientById(id: string): Promise<IClient> {
    const res = await api.get<ApiResponse<IClient>>(`/clients/${id}`);
    return res.data.data;
  },

  async createClient(name: string, phone: string): Promise<IClient> {
    const res = await api.post<ApiResponse<IClient>>('/clients', { name, phone });
    return res.data.data;
  },

  async updateClient(id: string, name?: string, phone?: string): Promise<IClient> {
    const res = await api.put<ApiResponse<IClient>>(`/clients/${id}`, { name, phone });
    return res.data.data;
  },

  async payDebt(id: string, amountPaid: number, notes?: string): Promise<IClient> {
    const res = await api.post<ApiResponse<IClient>>(`/clients/${id}/pay-debt`, { amountPaid, notes });
    return res.data.data;
  },
};
