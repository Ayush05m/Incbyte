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