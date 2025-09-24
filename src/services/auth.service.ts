import { User } from '@/types/auth.types';

const now = new Date().toISOString();

export const authService = {
  login: async (email: string, password: string): Promise<{ user: User, token: string }> => {
    console.log(`Attempting login for ${email}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (email === 'user@example.com' && password === 'password') {
      const user: User = { id: 1, email: 'user@example.com', username: 'Test User', role: 'user' as const, createdAt: now };
      return { user, token: 'mock-jwt-token-user' };
    }
    
    if (email === 'admin@example.com' && password === 'password') {
      const user: User = { id: 99, email: 'admin@example.com', username: 'Admin User', role: 'admin' as const, createdAt: now };
      return { user, token: 'mock-jwt-token-admin' };
    }

    if (email === 'demo@example.com' && password === 'password') {
      const user: User = { id: 100, email: 'demo@example.com', username: 'Demo User', role: 'user' as const, createdAt: now };
      return { user, token: 'mock-jwt-token-demo' };
    }
    
    throw new Error('Invalid credentials');
  },
  register: async (data: {email: string, password: string, username: string}): Promise<{ user: User, token: string }> => {
    console.log(`Attempting registration for ${data.email}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const user: User = { id: 2, email: data.email, username: data.username, role: 'user' as const, createdAt: now };
    return {
      user,
      token: 'mock-jwt-token-new'
    };
  }
};