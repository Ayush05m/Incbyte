import { api } from './api';
import { Sweet, SearchParams, CreateSweetDto, UpdateSweetDto } from '@/types/sweet.types';

export const sweetsService = {
  getSweets: async (params?: SearchParams): Promise<Sweet[]> => {
    const apiParams: { [key: string]: any } = {
      query: params?.query,
      category: params?.category,
    };

    if (params?.priceRange) {
      apiParams.min_price = params.priceRange[0];
      apiParams.max_price = params.priceRange[1];
    }

    // Filter out undefined/null params before sending
    Object.keys(apiParams).forEach(key => apiParams[key] === undefined && delete apiParams[key]);

    const response = await api.get('/sweets/', { params: apiParams });
    return response.data;
  },

  addSweet: async (sweetData: CreateSweetDto | FormData): Promise<Sweet> => {
    const response = await api.post('/sweets/', sweetData);
    return response.data;
  },

  updateSweet: async (sweetId: number, sweetData: UpdateSweetDto | FormData): Promise<Sweet> => {
    // When sending FormData, it's common to use POST for updates to avoid issues with PUT.
    // We'll append a _method field to signify a PUT request if the backend supports it,
    // or the backend can have a dedicated POST endpoint for updates.
    if (sweetData instanceof FormData) {
      const response = await api.post(`/sweets/${sweetId}`, sweetData);
      return response.data;
    }
    const response = await api.put(`/sweets/${sweetId}`, sweetData);
    return response.data;
  },

  deleteSweet: async (sweetId: number): Promise<void> => {
    await api.delete(`/sweets/${sweetId}`);
  },

  purchaseSweet: async (sweetId: number, quantity: number): Promise<{ success: boolean }> => {
    const response = await api.post(`/sweets/${sweetId}/purchase`, { quantity });
    return response.data;
  },

  restockSweet: async (sweetId: number, quantity: number): Promise<Sweet> => {
    const response = await api.post(`/sweets/${sweetId}/restock`, { quantity });
    return response.data;
  },

  updateSweetQuantity: async (sweetId: number, newQuantity: number): Promise<Sweet> => {
    const response = await api.patch(`/sweets/${sweetId}`, { quantity: newQuantity });
    return response.data;
  },
};