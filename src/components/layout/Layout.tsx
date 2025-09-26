import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { CartSheet } from '@/components/cart/CartSheet';
import { FlyToCartAnimation } from '@/components/animation/FlyToCartAnimation';
import { FloatingCartButton } from '@/components/cart/FloatingCartButton';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

export const Layout = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      {isAuthenticated && (
        <>
          <CartSheet />
          <FlyToCartAnimation />
          <FloatingCartButton />
        </>
      )}
      <motion.main
        className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <Outlet />
      </motion.main>
    </div>
  );
};