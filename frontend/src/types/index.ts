// Types compartilhados da aplicação

export interface User {
  id: string;
  name: string;
  email: string;
  score: number;
  referralCode: string;
  referralLink?: string;
  createdAt: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  referralCode?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken?: string;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}
