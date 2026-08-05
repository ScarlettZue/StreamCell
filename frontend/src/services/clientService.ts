import { api } from './api';
import { ApiResponse, IClient } from '../types';

export const clientService = {
  async getClients(search?: string, role?: string): Promise<IClient[]> {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (role && role !== 'ALL') params.role = role;
    const res = await api.get<ApiResponse<IClient[]>>('/clients', { params });
    return res.data.data;
  },

  async getClientById(id: string): Promise<IClient> {
    const res = await api.get<ApiResponse<IClient>>(`/clients/${id}`);
    return res.data.data;
  },

  async createClient(name: string, phone: string, role: string = 'CLIENTE', distributorId?: string | null): Promise<IClient> {
    const res = await api.post<ApiResponse<IClient>>('/clients', { name, phone, role, distributorId });
    return res.data.data;
  },

  async updateClient(id: string, name?: string, phone?: string, role?: string, distributorId?: string | null): Promise<IClient> {
    const res = await api.put<ApiResponse<IClient>>(`/clients/${id}`, { name, phone, role, distributorId });
    return res.data.data;
  },

  async deleteClient(id: string): Promise<void> {
    await api.delete(`/clients/${id}`);
  },

  async payDebt(id: string, amountPaid: number, notes?: string): Promise<IClient> {
    const res = await api.post<ApiResponse<IClient>>(`/clients/${id}/pay-debt`, { amountPaid, notes });
    return res.data.data;
  },
};
