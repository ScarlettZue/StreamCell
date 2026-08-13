import { api } from './api';
import { ApiResponse, IWhatsAppReminder } from '../types';

export const whatsappService = {
  async generateReminder(data: {
    clientName: string;
    phone: string;
    productName: string;
    dueDate: string | Date;
  }): Promise<IWhatsAppReminder> {
    const res = await api.post<ApiResponse<IWhatsAppReminder>>('/whatsapp/generate-reminder', data);
    return res.data.data;
  },
};
