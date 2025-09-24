import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { Candy } from 'lucide-react';

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

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
          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/admin" className="text-sm font-medium text-primary-600 hover:text-primary-700 font-semibold">
              Admin
            </Link>
          )}
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
        </div>
      </nav>
    </header>
  );
};