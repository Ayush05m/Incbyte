import { User } from '@/types/auth.types';

const now = new Date().toISOString();

const mockUsers: User[] = [
  { id: 1, email: 'user@example.com', username: 'Test User', role: 'user' as const, createdAt: now },
  { id: 99, email: 'admin@example.com', username: 'Admin User', role: 'admin' as const, createdAt: now },
  { id: 100, email: 'demo@example.com', username: 'Demo User', role: 'user' as const, createdAt: now },
];

let nextUserId = 101;

export const authService = {
  login: async (email: string, password: string): Promise<{ user: User, token: string }> => {
    console.log(`Attempting login for ${email}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = mockUsers.find(u => u.email === email);

    if (user) {
      return { user, token: `mock-jwt-token-${user.id}` };
    }
    
    const error: any = new Error('Invalid credentials');
    error.response = { status: 401, data: { message: 'Invalid credentials' } };
    throw error;
  },
  register: async (data: {email: string, password: string, username: string}): Promise<{ user: User, token: string }> => {
    console.log(`Attempting registration for ${data.email}`);
    await new Promise(resolve => setTimeout(resolve, 500));

    if (mockUsers.some(u => u.email === data.email)) {
      const error: any = new Error('Email already exists');
      error.response = { status: 409, data: { message: 'This email is already registered.' } };
      throw error;
    }

    const newUser: User = { 
      id: nextUserId++, 
      email: data.email, 
      username: data.username, 
      role: 'user' as const, 
      createdAt: new Date().toISOString() 
    };
    mockUsers.push(newUser);

    return {
      user: newUser,
      token: `mock-jwt-token-${newUser.id}`
    };
  }
};