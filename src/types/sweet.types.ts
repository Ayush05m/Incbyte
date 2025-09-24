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

export interface SearchParams {
  query?: string;
  category?: string;
}