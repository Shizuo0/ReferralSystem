import type { RegisterData, AuthResponse, ApiError } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class ApiService {
  /**
   * Registra um novo usuário
   */
  static async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw responseData as ApiError;
    }

    return responseData as AuthResponse;
  }

  /**
   * Faz login de um usuário
   */
  static async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw responseData as ApiError;
    }

    return responseData as AuthResponse;
  }

  /**
   * Busca perfil do usuário autenticado
   */
  static async getProfile(token: string): Promise<any> {
    const response = await fetch(`${API_URL}/user/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw responseData as ApiError;
    }

    return responseData;
  }
}
