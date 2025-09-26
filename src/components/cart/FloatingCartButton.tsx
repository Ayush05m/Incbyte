import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, useCartTotals } from '@/store/cartStore';
import { useUiStore } from '@/store/uiStore';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

export const FloatingCartButton = () => {
  const { toggleCart } = useCartStore();
  const { cartCount } = useCartTotals();
  const { setCartIconRef } = useUiStore();
  const cartButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (cartButtonRef.current) {
      setCartIconRef(cartButtonRef);
    }
  }, [setCartIconRef]);

  return (
    <AnimatePresence>
      {cartCount > 0 && (
        <motion.div
          initial={{ scale: 0, y: 100 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0, y: 100 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <Button
            ref={cartButtonRef}
            onClick={toggleCart}
            className="relative h-16 w-16 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 text-white shadow-2xl transition-transform duration-300 hover:scale-110"
          >
            <ShoppingCart className="h-7 w-7" />
            <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-primary-600 text-xs font-bold text-white">
              {cartCount}
            </span>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};