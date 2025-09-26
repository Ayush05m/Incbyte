import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { Candy, Menu, UserCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const NavLinks: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLinkClass = (path: string) => {
    return cn(
      "transition-colors hover:text-primary",
      location.pathname === path ? "text-primary font-semibold" : "text-muted-foreground",
      isMobile ? "text-lg p-2 rounded-md hover:bg-accent w-full text-left" : "text-sm font-medium"
    );
  };

  const NavLinkWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return isMobile ? <SheetClose asChild>{children}</SheetClose> : <>{children}</>;
  };

  return (
    <div className={cn("flex items-center", isMobile ? "flex-col items-start gap-4 w-full" : "gap-6")}>
      <NavLinkWrapper>
        <Link to="/" className={getLinkClass('/')}>
          Sweets
        </Link>
      </NavLinkWrapper>
      
      <div className={cn("w-full h-px bg-border my-2", isMobile ? "block" : "hidden")} />

      {isAuthenticated ? (
        <div className={cn("flex items-center", isMobile ? "flex-col items-start gap-4 w-full" : "gap-4")}>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <UserCircle className="h-5 w-5 text-muted-foreground" />
            <span>{user?.username}</span>
          </div>
          <Button variant="outline" size={isMobile ? "lg" : "sm"} onClick={handleLogout} className={isMobile ? "w-full" : ""}>
            Logout
          </Button>
        </div>
      ) : (
        <div className={cn("flex items-center", isMobile ? "flex-col items-start gap-4 w-full" : "gap-2")}>
          <NavLinkWrapper>
            <Button asChild variant="ghost" size={isMobile ? "lg" : "sm"} className={cn(isMobile && "w-full justify-start p-2 text-lg")}>
              <Link to="/login">Login</Link>
            </Button>
          </NavLinkWrapper>
          <NavLinkWrapper>
            <Button asChild size={isMobile ? "lg" : "sm"} className={isMobile ? "w-full" : ""}>
              <Link to="/register">Register</Link>
            </Button>
          </NavLinkWrapper>
        </div>
      )}
    </div>
  );
};

export const Header: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full border-b bg-background/80 backdrop-blur-lg">
      <nav className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary transition-transform hover:scale-105">
          <Candy className="h-7 w-7" />
          <span className="hidden sm:inline">Sweet Shop</span>
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
              <div className="p-4">
                <Link to="/" className="flex items-center gap-2 text-lg font-bold text-primary mb-8">
                  <Candy className="h-6 w-6" />
                  <span>Sweet Shop</span>
                </Link>
                <NavLinks isMobile={true} />
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <NavLinks />
        )}
      </nav>
    </header>
  );
};