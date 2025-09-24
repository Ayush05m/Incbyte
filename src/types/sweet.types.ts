export interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSweetDto extends Omit<Sweet, 'id' | 'createdAt' | 'updatedAt'> {}
export type UpdateSweetDto = Partial<CreateSweetDto>;

export interface SearchParams {
  query?: string;
  category?: string;
  priceRange?: [number, number];
}

// Sweet.ts
export interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  created_at?: string;
}
export interface SweetCreate {
  name: string;
  category: string;
  price: number;
  stock: number;
}
export interface SweetUpdate {
  name?: string;
  category?: string;
  price?: number;
  stock?: number;
}
export interface SweetPurchase {
  quantity: number;
}
export interface SweetRestock {
  quantity: number;
}