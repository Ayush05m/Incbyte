import { api } from './api';
import { User, UserCreate, UserLogin } from '@/types/auth.types';

// A helper function to perform the two-step auth process
const authenticateAndFetchUser = async (authPromise: Promise<any>): Promise<{ user: User; token: string }> => {
  // Step 1: Get the token from the auth endpoint
  const authResponse = await authPromise;
  const token = authResponse.data.access_token;
  console.log(authPromise);
  if (!token) {
    throw new Error("Authentication failed: No token received from the server.");
  }

  // Step 2: Use the token to fetch the user's data from the /users/me endpoint
  const userResponse = await api.get('/users/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const user = userResponse.data;

  // Step 3: Return the user object and token
  return { user, token };
};

export const authService = {
  login: async (credentials: UserLogin): Promise<{ user: User; token: string }> => {
    // The backend's /auth/login endpoint expects a JSON body with email and password.
    const authPromise = api.post('/auth/login', credentials);

    return authenticateAndFetchUser(authPromise);
  },
  register: async (data: UserCreate): Promise<User> => {
    // Register endpoint creates a user but does not log them in
    const response = await api.post('/users/', data);
    return response.data;
  },
};