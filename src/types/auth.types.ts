export interface User {
  id: number;
  email: string;
  username: string;
  role: 'user' | 'admin';
  createdAt: string;
}