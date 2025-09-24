import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/auth.types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) =>
        set({ user, token, isAuthenticated: true }),
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        // Optionally, redirect to login page
        // window.location.href = '/login';
      },
    }),
    {
      name: 'auth-storage', // unique name
    }
  )
);