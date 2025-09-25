import { api } from './api';
import { Sweet, SearchParams, SweetFormData, UpdateSweetFormData } from '@/types/sweet.types';

const createSweetFormData = (sweetData: SweetFormData | UpdateSweetFormData): FormData => {
  const formData = new FormData();
  const data: { [key: string]: any } = { ...sweetData };

  if (data.imageFile instanceof File) {
    formData.append('image_file', data.imageFile);
    // Don't send imageUrl, backend will generate it from the file
    delete data.imageUrl;
  } else if (data.imageUrl && typeof data.imageUrl === 'string' && data.imageUrl.startsWith('blob:')) {
    // This is a preview of an image that hasn't changed, so don't send it.
    delete data.imageUrl;
  }
  
  delete data.imageFile;

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });

  return formData;
};

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

  addSweet: async (sweetData: SweetFormData): Promise<Sweet> => {
    const formData = createSweetFormData(sweetData);
    const response = await api.post('/sweets/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateSweet: async (sweetId: number, sweetData: UpdateSweetFormData): Promise<Sweet> => {
    const formData = createSweetFormData(sweetData);
    const response = await api.put(`/sweets/${sweetId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
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