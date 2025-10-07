import type { RegisterData, AuthResponse, ApiError } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const TIMEOUT = 10000; // 10 segundos

/**
 * Fetch com timeout para evitar requests infinitos
 */
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw {
        statusCode: 408,
        message: 'Tempo de resposta esgotado. Verifique sua conexão.',
        error: 'Request Timeout',
      } as ApiError;
    }
    
    throw error;
  }
};

export class ApiService {
  /**
   * Registra um novo usuário
   */
  static async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetchWithTimeout(`${API_URL}/auth/register`, {
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
    const response = await fetchWithTimeout(`${API_URL}/auth/login`, {
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
    const response = await fetchWithTimeout(`${API_URL}/user/profile`, {
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
