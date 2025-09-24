import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { CartSheet } from '@/components/cart/CartSheet';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <CartSheet />
      <main>
        <Outlet />
      </main>
    </div>
  );
};