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

// This is a new type for the form data, including the optional file
export interface SweetFormData extends CreateSweetDto {
  imageFile?: File | null;
}

// This is for updating with a file
export type UpdateSweetFormData = Partial<SweetFormData>;

export interface SearchParams {
  query?: string;
  category?: string;
  priceRange?: [number, number];
}