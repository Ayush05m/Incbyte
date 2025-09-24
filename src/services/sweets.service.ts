import { Sweet, SearchParams } from '@/types/sweet.types';

const mockSweets: Sweet[] = [
  { id: '1', name: 'Chocolate Fudge Cake', category: 'Cakes', price: 25.99, quantity: 10, description: 'Rich and decadent chocolate fudge cake.', imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400' },
  { id: '2', name: 'Rainbow Macarons', category: 'Pastries', price: 12.50, quantity: 25, description: 'A colorful assortment of almond meringue cookies.', imageUrl: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?q=80&w=400' },
  { id: '3', name: 'Glazed Doughnuts', category: 'Pastries', price: 8.99, quantity: 30, description: 'Classic, sweet, and fluffy glazed doughnuts.', imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78d8d590d?q=80&w=400' },
  { id: '4', name: 'Gummy Bears', category: 'Candies', price: 5.00, quantity: 100, description: 'Fruity, chewy, and fun gummy candies.', imageUrl: 'https://images.unsplash.com/photo-1600359763299-4360fd636350?q=80&w=400' },
  { id: '5', name: 'Vanilla Ice Cream', category: 'Frozen', price: 6.50, quantity: 15, description: 'Creamy and smooth vanilla bean ice cream.', imageUrl: 'https://images.unsplash.com/photo-1570197788417-0e82375c934d?q=80&w=400' },
  { id: '6', name: 'Strawberry Cheesecake', category: 'Cakes', price: 30.00, quantity: 8, description: 'A delightful cheesecake with a strawberry topping.', imageUrl: 'https://images.unsplash.com/photo-1565791204914-366e27aa29c3?q=80&w=400' },
];

export const sweetsService = {
  getSweets: async (params?: SearchParams): Promise<Sweet[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    let sweets = mockSweets;
    if (params?.query) {
        sweets = sweets.filter(s => s.name.toLowerCase().includes(params.query!.toLowerCase()));
    }
    return sweets;
  },
  purchaseSweet: async (sweetId: string, quantity: number): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Purchased ${quantity} of sweet ${sweetId}`);
    return { success: true };
  },
  updateSweetQuantity: async (sweetId: string, newQuantity: number): Promise<Sweet> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const sweetIndex = mockSweets.findIndex(s => s.id === sweetId);
    if (sweetIndex === -1) {
      throw new Error("Sweet not found");
    }
    mockSweets[sweetIndex].quantity = newQuantity;
    return mockSweets[sweetIndex];
  }
};