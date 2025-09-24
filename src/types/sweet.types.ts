export interface Sweet {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  imageUrl: string;
}

export interface CreateSweetDto extends Omit<Sweet, 'id'> {}
export type UpdateSweetDto = Partial<CreateSweetDto>;

export interface SearchParams {
  query?: string;
  category?: string;
  priceRange?: [number, number];
}