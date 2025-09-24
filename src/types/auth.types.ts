export interface User {
  id: number;
  email: string;
  username: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}