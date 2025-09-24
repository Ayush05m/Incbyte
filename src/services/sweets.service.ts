import { api } from './api';
import { Sweet, SearchParams, CreateSweetDto, UpdateSweetDto } from '@/types/sweet.types';

export const sweetsService = {
  getSweets: async (params?: SearchParams): Promise<Sweet[]> => {
    const response = await api.get('/sweets', { params });
    return response.data;
  },

  addSweet: async (sweetData: CreateSweetDto): Promise<Sweet> => {
    const response = await api.post('/sweets', sweetData);
    return response.data;
  },

  updateSweet: async (sweetId: number, sweetData: UpdateSweetDto): Promise<Sweet> => {
    const response = await api.patch(`/sweets/${sweetId}`, sweetData);
    return response.data;
  },

  deleteSweet: async (sweetId: number): Promise<void> => {
    await api.delete(`/sweets/${sweetId}`);
  },

  purchaseSweet: async (sweetId: number, quantity: number): Promise<{ success: boolean }> => {
    const response = await api.post(`/sweets/${sweetId}/purchase`, { quantity });
    return response.data;
  },

  updateSweetQuantity: async (sweetId: number, newQuantity: number): Promise<Sweet> => {
    const response = await api.patch(`/sweets/${sweetId}`, { quantity: newQuantity });
    return response.data;
  },
};