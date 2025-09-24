import { api } from './api';
import { User } from '@/types/auth.types';

export const authService = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (data: {
    email: string;
    password: string;
    username: string;
  }): Promise<{ user: User; token: string }> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};