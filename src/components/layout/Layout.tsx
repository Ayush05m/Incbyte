import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { CartSheet } from '@/components/cart/CartSheet';
import { FlyToCartAnimation } from '@/components/animation/FlyToCartAnimation';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <CartSheet />
      <FlyToCartAnimation />
      <main>
        <Outlet />
      </main>
    </div>
  );
};