import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { Navigate, useLocation } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
  isPrivate: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, isPrivate }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (isPrivate) {
    // For private routes like /
    if (!isAuthenticated) {
      // If not authenticated, redirect to login, saving the original destination
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  } else {
    // For public-only routes like /login, /register
    if (isAuthenticated) {
      // If already authenticated, redirect to the main dashboard
      return <Navigate to="/" replace />;
    }
  }

  // If all checks pass, render the requested page
  return <>{children}</>;
};