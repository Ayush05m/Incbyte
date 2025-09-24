// User.ts
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at?: string; // if present
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

// Token.ts
export interface Token {
  access_token: string;
  token_type: string;
}