import { api } from './api';
import { User } from '@/types/auth.types';

// A helper function to perform the two-step auth process
const authenticateAndFetchUser = async (authPromise: Promise<any>): Promise<{ user: User; token: string }> => {
  // Step 1: Get the token from either login or register
  const authResponse = await authPromise;
  const token = authResponse.data.access_token;

  if (!token) {
    throw new Error("Authentication failed: No token received from the server.");
  }

  // Step 2: Use the token to fetch the user's data from a /users/me endpoint
  // We pass the token in the header manually for this one request.
  // After this, the token will be in our global store, and the api interceptor will handle it.
  const userResponse = await api.get('/users/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const user = userResponse.data;

  // Step 3: Return the user object and token, as the rest of the app expects
  return { user, token };
};

export const authService = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    return authenticateAndFetchUser(api.post('/auth/login', { email, password }));
  },
  register: async (data: {
    email: string;
    password: string;
    username: string;
  }): Promise<{ user: User; token: string }> => {
    return authenticateAndFetchUser(api.post('/auth/register', data));
  },
};