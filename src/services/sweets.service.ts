import {
  mockGetSweets,
  mockAddSweet,
  mockUpdateSweet,
  mockDeleteSweet,
  mockPurchaseSweet,
  mockUpdateSweetQuantity,
} from './mockApi';

export const sweetsService = {
  getSweets: mockGetSweets,
  addSweet: mockAddSweet,
  updateSweet: mockUpdateSweet,
  deleteSweet: mockDeleteSweet,
  purchaseSweet: mockPurchaseSweet,
  updateSweetQuantity: mockUpdateSweetQuantity,
};