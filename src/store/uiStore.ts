import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface FlyingItemData {
  id: string;
  imageUrl: string;
  sourceRect: DOMRect;
}

interface UiState {
  cartIconRef: React.RefObject<HTMLButtonElement> | null;
  setCartIconRef: (ref: React.RefObject<HTMLButtonElement>) => void;
  flyingItems: FlyingItemData[];
  addFlyingItem: (imageUrl: string, sourceRect: DOMRect) => void;
  removeFlyingItem: (id: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  cartIconRef: null,
  setCartIconRef: (ref) => set({ cartIconRef: ref }),
  flyingItems: [],
  addFlyingItem: (imageUrl, sourceRect) => {
    const newItem = { id: uuidv4(), imageUrl, sourceRect };
    set((state) => ({ flyingItems: [...state.flyingItems, newItem] }));
  },
  removeFlyingItem: (id) => {
    set((state) => ({
      flyingItems: state.flyingItems.filter((item) => item.id !== id),
    }));
  },
}));