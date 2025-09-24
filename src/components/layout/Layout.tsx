import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};