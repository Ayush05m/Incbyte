import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { Candy, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

const NavLinks: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = isMobile
    ? "text-lg font-medium text-gray-700 hover:text-primary-600 w-full text-left p-2 rounded-md hover:bg-gray-100"
    : "text-sm font-medium text-gray-600 hover:text-primary-600";

  // This wrapper ensures SheetClose is only used in the mobile context
  const NavLinkWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (isMobile) {
      return <SheetClose asChild>{children}</SheetClose>;
    }
    return <>{children}</>;
  };

  return (
    <div className={isMobile ? "flex flex-col items-start gap-4 w-full" : "flex items-center gap-4"}>
      <NavLinkWrapper>
        <Link to="/dashboard" className={linkClass}>
          Dashboard
        </Link>
      </NavLinkWrapper>
      {isAuthenticated ? (
        <>
          <span className={isMobile ? "text-lg text-gray-700 p-2" : "text-sm text-gray-700"}>
            Welcome, {user?.username}!
          </span>
          <Button variant="outline" size={isMobile ? "lg" : "sm"} onClick={handleLogout} className={isMobile ? "w-full" : ""}>
            Logout
          </Button>
        </>
      ) : (
        <>
          <NavLinkWrapper>
            <Button asChild variant="ghost" size={isMobile ? "lg" : "sm"} className={isMobile ? "w-full justify-start p-2" : ""}>
              <Link to="/login">Login</Link>
            </Button>
          </NavLinkWrapper>
          <NavLinkWrapper>
            <Button asChild size={isMobile ? "lg" : "sm"} className={isMobile ? "w-full" : ""}>
              <Link to="/register">Register</Link>
            </Button>
          </NavLinkWrapper>
        </>
      )}
    </div>
  );
};

export const Header: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full border-b bg-white/80 backdrop-blur-lg transition-all duration-300">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-600">
          <Candy className="h-6 w-6" />
          <span>Sweet Shop</span>
        </Link>
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="mt-8">
                <NavLinks isMobile={true} />
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="flex items-center gap-4">
            <NavLinks />
          </div>
        )}
      </nav>
    </header>
  );
};