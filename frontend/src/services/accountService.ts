import { api } from './api';
import { ApiResponse, IAccount, IAccountProfile } from '../types';

export interface ProfileInput {
  profileName: string;
  hasPin: boolean;
  pin?: string;
  userEmail?: string;
  spotifyUsername?: string;
  familyAddress?: string;
  isSold?: boolean;
  clientId?: string;
  serviceStartDate?: string;
  serviceEndDate?: string;
  saleCost?: number;
  salePrice?: number;
}

export interface CreateAccountInput {
  productId: string;
  email: string;
  password?: string;
  startDate?: string;
  dueDate?: string;
  notes?: string;
  profiles: ProfileInput[];
}

export const accountService = {
  async getAccounts(): Promise<IAccount[]> {
    const res = await api.get<ApiResponse<IAccount[]>>('/accounts');
    return res.data.data;
  },

  async getAvailableProfiles(): Promise<IAccountProfile[]> {
    const res = await api.get<ApiResponse<IAccountProfile[]>>('/accounts/profiles/available');
    return res.data.data;
  },

  async createAccount(data: CreateAccountInput): Promise<IAccount> {
    const res = await api.post<ApiResponse<IAccount>>('/accounts', data);
    return res.data.data;
  },

  async updateAccount(
    id: string,
    data: Partial<{
      email: string;
      password?: string;
      startDate?: string;
      dueDate?: string;
      notes?: string;
      profiles?: Array<{
        id?: string;
        profileName?: string;
        hasPin?: boolean;
        pin?: string;
        isSold?: boolean;
        clientId?: string;
      }>;
    }>
  ): Promise<IAccount> {
    const res = await api.put<ApiResponse<IAccount>>(`/accounts/${id}`, data);
    return res.data.data;
  },

  async deleteAccount(id: string): Promise<void> {
    await api.delete(`/accounts/${id}`);
  },
};
