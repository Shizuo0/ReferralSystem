import type { RegisterData, AuthResponse, ApiError } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const TIMEOUT = 10000; // 10 segundos
const MAX_RETRIES = 2; // Máximo de tentativas

/**
 * Fetch com timeout e retry para evitar requests infinitos
 */
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  retries = MAX_RETRIES
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
    
    // Erro de timeout
    if (error.name === 'AbortError') {
      if (retries > 0) {
        console.warn(`Timeout, tentando novamente... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Aguardar 1s
        return fetchWithTimeout(url, options, retries - 1);
      }
      
      throw {
        statusCode: 408,
        message: 'Tempo de resposta esgotado. Verifique sua conexão.',
        error: 'Request Timeout',
      } as ApiError;
    }
    
    // Erro de rede (offline, DNS, etc)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw {
        statusCode: 503,
        message: 'Não foi possível conectar ao servidor. Verifique sua conexão de internet.',
        error: 'Network Error',
      } as ApiError;
    }
    
    throw error;
  }
};

/**
 * Parse seguro de JSON response
 */
const safeJsonParse = async (response: Response): Promise<any> => {
  try {
    const text = await response.text();
    
    if (!text || text.trim() === '') {
      return null;
    }
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Erro ao parsear JSON:', error);
    throw {
      statusCode: 500,
      message: 'Resposta do servidor inválida',
      error: 'Invalid JSON Response',
    } as ApiError;
  }
};

/**
 * Validar dados antes de enviar
 */
const validateRegisterData = (data: RegisterData): void => {
  // Validar nome
  if (!data.name || !data.name.trim()) {
    throw {
      statusCode: 400,
      message: 'Nome não pode estar vazio',
      error: 'Validation Error',
    } as ApiError;
  }
  
  if (data.name.trim().length > 100) {
    throw {
      statusCode: 400,
      message: 'Nome muito longo (máximo 100 caracteres)',
      error: 'Validation Error',
    } as ApiError;
  }
  
  // Validar email
  if (!data.email || !data.email.trim()) {
    throw {
      statusCode: 400,
      message: 'Email não pode estar vazio',
      error: 'Validation Error',
    } as ApiError;
  }
  
  if (data.email.length > 255) {
    throw {
      statusCode: 400,
      message: 'Email muito longo (máximo 255 caracteres)',
      error: 'Validation Error',
    } as ApiError;
  }
  
  // Validar senha
  if (!data.password || data.password.trim() === '') {
    throw {
      statusCode: 400,
      message: 'Senha não pode conter apenas espaços',
      error: 'Validation Error',
    } as ApiError;
  }
  
  if (data.password.length > 72) { // bcrypt limit
    throw {
      statusCode: 400,
      message: 'Senha muito longa (máximo 72 caracteres)',
      error: 'Validation Error',
    } as ApiError;
  }
};

export class ApiService {
  /**
   * Registra um novo usuário
   */
  static async register(data: RegisterData): Promise<AuthResponse> {
    // Validar dados antes de enviar
    validateRegisterData(data);
    
    // Normalizar dados
    const normalizedData = {
      ...data,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      referralCode: data.referralCode?.trim().toUpperCase() || undefined,
    };
    
    const response = await fetchWithTimeout(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(normalizedData),
    });

    const responseData = await safeJsonParse(response);

    if (!response.ok) {
      throw responseData as ApiError;
    }
    
    // Validar estrutura da resposta
    if (!responseData || !responseData.user) {
      throw {
        statusCode: 500,
        message: 'Resposta do servidor inválida',
        error: 'Invalid Response Structure',
      } as ApiError;
    }

    return responseData as AuthResponse;
  }

  /**
   * Faz login de um usuário
   */
  static async login(email: string, password: string): Promise<AuthResponse> {
    // Validar dados
    if (!email || !email.trim()) {
      throw {
        statusCode: 400,
        message: 'Email não pode estar vazio',
        error: 'Validation Error',
      } as ApiError;
    }
    
    if (!password) {
      throw {
        statusCode: 400,
        message: 'Senha não pode estar vazia',
        error: 'Validation Error',
      } as ApiError;
    }
    
    // Normalizar email
    const normalizedEmail = email.trim().toLowerCase();
    
    const response = await fetchWithTimeout(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: normalizedEmail, password }),
    });

    const responseData = await safeJsonParse(response);

    if (!response.ok) {
      throw responseData as ApiError;
    }
    
    // Validar estrutura da resposta
    if (!responseData || !responseData.accessToken) {
      throw {
        statusCode: 500,
        message: 'Resposta do servidor inválida',
        error: 'Invalid Response Structure',
      } as ApiError;
    }

    return responseData as AuthResponse;
  }

  /**
   * Busca perfil do usuário autenticado
   */
  static async getProfile(token: string): Promise<any> {
    // Validar token
    if (!token || !token.trim()) {
      throw {
        statusCode: 401,
        message: 'Token de autenticação não fornecido',
        error: 'Unauthorized',
      } as ApiError;
    }
    
    const response = await fetchWithTimeout(`${API_URL}/user/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
      },
    });

    const responseData = await safeJsonParse(response);

    if (!response.ok) {
      throw responseData as ApiError;
    }
    
    // Validar estrutura da resposta
    if (!responseData || !responseData.id) {
      throw {
        statusCode: 500,
        message: 'Resposta do servidor inválida',
        error: 'Invalid Response Structure',
      } as ApiError;
    }

    return responseData;
  }
}
