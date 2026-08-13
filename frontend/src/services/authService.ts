import { api } from './api';
import { ApiResponse, IUser } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<{ token: string; user: IUser }> {
    const res = await api.post<ApiResponse<{ token: string; user: IUser }>>('/auth/login', {
      email,
      password,
    });
    return res.data.data;
  },

  async seedAdmin(email: string, password: string, name: string): Promise<IUser> {
    const res = await api.post<ApiResponse<IUser>>('/auth/seed-admin', {
      email,
      password,
      name,
    });
    return res.data.data;
  },
};
