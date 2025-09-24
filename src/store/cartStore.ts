import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Sweet } from '@/types/sweet.types';
import { toast } from 'sonner';

export interface CartItem extends Sweet {
  quantityInCart: number;
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  addItem: (sweet: Sweet, quantity: number) => void;
  removeItem: (sweetId: number) => void;
  updateItemQuantity: (sweetId: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      
      addItem: (sweet, quantity) => {
        const { items } = get();
        const existingItem = items.find((item) => item.id === sweet.id);

        if (quantity > sweet.quantity) {
          toast.error(`Only ${sweet.quantity} of ${sweet.name} available in stock.`);
          return;
        }

        if (existingItem) {
          const newQuantity = existingItem.quantityInCart + quantity;
          if (newQuantity > sweet.quantity) {
            toast.error(`Cannot add more ${sweet.name}. Only ${sweet.quantity} available in stock.`);
            return;
          }
          set({
            items: items.map((item) =>
              item.id === sweet.id
                ? { ...item, quantityInCart: newQuantity }
                : item
            ),
          });
          toast.success(`${quantity} more ${sweet.name} added to cart.`);
        } else {
          set({ items: [...items, { ...sweet, quantityInCart: quantity }] });
          toast.success(`${sweet.name} added to cart.`);
        }
      },

      removeItem: (sweetId) => {
        set({ items: get().items.filter((item) => item.id !== sweetId) });
        toast.info("Item removed from cart.");
      },

      updateItemQuantity: (sweetId, quantity) => {
        set({
          items: get().items.map((item) => {
            if (item.id === sweetId) {
              if (quantity > item.quantity) {
                toast.error(`Only ${item.quantity} of ${item.name} available in stock.`);
                return { ...item, quantityInCart: item.quantity };
              }
              return { ...item, quantityInCart: Math.max(0, quantity) };
            }
            return item;
          }).filter(item => item.quantityInCart > 0), // Remove if quantity is 0
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: () => {
        set((state) => ({ isCartOpen: !state.isCartOpen }));
      },

      setCartOpen: (isOpen) => {
        set({ isCartOpen: isOpen });
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);

// Selectors
export const useCartTotals = () => {
  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((total, item) => total + item.quantityInCart, 0);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantityInCart, 0);
  return { cartCount, totalPrice };
};