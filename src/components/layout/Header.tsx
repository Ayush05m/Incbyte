import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { Candy, ShoppingCart } from 'lucide-react';
import { useCartStore, useCartTotals } from '@/store/cartStore';
import { useUiStore } from '@/store/uiStore';
import React, { useRef, useEffect } from 'react';

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { toggleCart } = useCartStore();
  const { cartCount } = useCartTotals();
  const navigate = useNavigate();
  const { setCartIconRef } = useUiStore();
  const cartButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (cartButtonRef.current) {
      setCartIconRef(cartButtonRef);
    }
  }, [setCartIconRef]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-600">
          <Candy className="h-6 w-6" />
          <span>Sweet Shop</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-primary-600">
            Dashboard
          </Link>
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-700">Welcome, {user?.username}!</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
          <Button ref={cartButtonRef} variant="ghost" size="icon" onClick={toggleCart} className="relative">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-xs text-white">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </nav>
    </header>
  );
};