import { Sweet, SearchParams, CreateSweetDto, UpdateSweetDto } from '@/types/sweet.types';

const now = new Date().toISOString();

let mockSweets: Sweet[] = [
  { id: 1, name: 'Chocolate Fudge Cake', category: 'Cakes', price: 25.99, quantity: 10, description: 'Rich and decadent chocolate fudge cake.', imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400', createdAt: now, updatedAt: now },
  { id: 2, name: 'Rainbow Macarons', category: 'Pastries', price: 12.50, quantity: 25, description: 'A colorful assortment of almond meringue cookies.', imageUrl: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?q=80&w=400', createdAt: now, updatedAt: now },
  { id: 3, name: 'Glazed Doughnuts', category: 'Pastries', price: 8.99, quantity: 30, description: 'Classic, sweet, and fluffy glazed doughnuts.', imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78d8d590d?q=80&w=400', createdAt: now, updatedAt: now },
  { id: 4, name: 'Gummy Bears', category: 'Candies', price: 5.00, quantity: 100, description: 'Fruity, chewy, and fun gummy candies.', imageUrl: 'https://images.unsplash.com/photo-1600359763299-4360fd636350?q=80&w=400', createdAt: now, updatedAt: now },
  { id: 5, name: 'Vanilla Ice Cream', category: 'Frozen', price: 6.50, quantity: 15, description: 'Creamy and smooth vanilla bean ice cream.', imageUrl: 'https://images.unsplash.com/photo-1570197788417-0e82375c934d?q=80&w=400', createdAt: now, updatedAt: now },
  { id: 6, name: 'Strawberry Cheesecake', category: 'Cakes', price: 30.00, quantity: 8, description: 'A delightful cheesecake with a strawberry topping.', imageUrl: 'https://images.unsplash.com/photo-1565791204914-366e27aa29c3?q=80&w=400', createdAt: now, updatedAt: now },
];

let nextId = mockSweets.length + 1;

const createApiError = (status: number, message: string) => {
  const error: any = new Error(message);
  error.response = { status, data: { message } };
  return error;
};

export const sweetsService = {
  getSweets: async (params?: SearchParams): Promise<Sweet[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    let sweets = [...mockSweets];
    if (params?.query) {
      sweets = sweets.filter(s => s.name.toLowerCase().includes(params.query!.toLowerCase()));
    }
    if (params?.category) {
      sweets = sweets.filter(s => s.category === params.category);
    }
    if (params?.priceRange) {
      sweets = sweets.filter(s => s.price >= params.priceRange![0] && s.price <= params.priceRange![1]);
    }
    return sweets;
  },
  
  addSweet: async (sweetData: CreateSweetDto): Promise<Sweet> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newSweet: Sweet = { 
      ...sweetData, 
      id: nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockSweets.unshift(newSweet);
    return newSweet;
  },

  updateSweet: async (sweetId: number, sweetData: UpdateSweetDto): Promise<Sweet> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockSweets.findIndex(s => s.id === sweetId);
    if (index === -1) {
      throw createApiError(404, "Sweet not found.");
    }
    mockSweets[index] = { ...mockSweets[index], ...sweetData, updatedAt: new Date().toISOString() };
    return mockSweets[index];
  },

  deleteSweet: async (sweetId: number): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const initialLength = mockSweets.length;
    mockSweets = mockSweets.filter(s => s.id !== sweetId);
    if (mockSweets.length === initialLength) {
      throw createApiError(404, "Sweet not found.");
    }
    return { success: true };
  },

  purchaseSweet: async (sweetId: number, quantity: number): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const sweetIndex = mockSweets.findIndex(s => s.id === sweetId);
    if (sweetIndex === -1) {
      throw createApiError(404, "Sweet not found.");
    }

    const sweet = mockSweets[sweetIndex];
    if (sweet.quantity < quantity) {
      throw createApiError(400, 'Not enough items in stock.');
    }

    mockSweets[sweetIndex].quantity -= quantity;
    console.log(`Purchased ${quantity} of sweet ${sweetId}. New quantity: ${mockSweets[sweetIndex].quantity}`);
    return { success: true };
  },

  updateSweetQuantity: async (sweetId: number, newQuantity: number): Promise<Sweet> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const sweetIndex = mockSweets.findIndex(s => s.id === sweetId);
    if (sweetIndex === -1) {
      throw createApiError(404, "Sweet not found.");
    }
    mockSweets[sweetIndex].quantity = newQuantity;
    mockSweets[sweetIndex].updatedAt = new Date().toISOString();
    return mockSweets[sweetIndex];
  }
};