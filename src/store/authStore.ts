import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import { User } from '@/types/auth.types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const storage: PersistStorage<AuthState> = {
  getItem: (name) => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    try {
      return JSON.parse(str);
    } catch (e) {
      console.error("Failed to parse auth storage, the data might be corrupted:", e);
      return null;
    }
  },
  setItem: (name, value) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

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
        // Redirect to login page after logout for security
        window.location.href = '/login';
      },
    }),
    {
      name: 'auth-storage',
      storage: storage,
    }
  )
);