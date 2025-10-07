/**
 * Utilitário centralizado para tratamento de erros
 */

import type { ApiError } from '../types';

/**
 * Formata mensagem de erro para exibição ao usuário
 */
export function formatErrorMessage(error: unknown): string {
  // Se é um ApiError conhecido
  if (isApiError(error)) {
    return formatApiError(error);
  }

  // Se é um Error nativo
  if (error instanceof Error) {
    return error.message || 'Erro desconhecido';
  }

  // Se é uma string
  if (typeof error === 'string') {
    return error;
  }

  // Último recurso
  return 'Erro inesperado. Tente novamente.';
}

/**
 * Verifica se o erro é um ApiError
 */
function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    'message' in error
  );
}

/**
 * Formata um ApiError para mensagem amigável
 */
function formatApiError(error: ApiError): string {
  const { statusCode, message } = error;

  // Tratar mensagem que pode ser string ou array
  let errorMessage: string;
  
  if (Array.isArray(message)) {
    errorMessage = message.join(', ');
  } else if (typeof message === 'string') {
    errorMessage = message;
  } else {
    errorMessage = 'Erro desconhecido';
  }

  // Adicionar contexto baseado no status code
  switch (statusCode) {
    case 0:
      return 'Sem conexão com o servidor. Verifique sua internet.';
    case 400:
      return `Dados inválidos: ${errorMessage}`;
    case 401:
      return 'Não autorizado. Faça login novamente.';
    case 403:
      return 'Acesso negado.';
    case 404:
      return 'Recurso não encontrado.';
    case 408:
      return 'Tempo de resposta esgotado. Tente novamente.';
    case 409:
      return errorMessage; // Conflito (ex: email já cadastrado)
    case 422:
      return `Dados inválidos: ${errorMessage}`;
    case 429:
      return 'Muitas tentativas. Aguarde um momento.';
    case 500:
      return 'Erro interno do servidor. Tente novamente mais tarde.';
    case 503:
      return 'Serviço temporariamente indisponível.';
    default:
      return errorMessage;
  }
}

/**
 * Log de erro com contexto (apenas em desenvolvimento)
 */
export function logError(error: unknown, context?: string): void {
  if (import.meta.env.DEV) {
    console.error(`[Error${context ? ` - ${context}` : ''}]:`, error);
    
    // Se é ApiError, mostrar mais detalhes
    if (isApiError(error)) {
      console.error('Status Code:', error.statusCode);
      console.error('Message:', error.message);
      if (error.error) {
        console.error('Error Type:', error.error);
      }
    }
  }
}

/**
 * Determina se erro é temporário (vale tentar novamente)
 */
export function isTemporaryError(error: unknown): boolean {
  if (!isApiError(error)) {
    return false;
  }

  const temporaryStatusCodes = [0, 408, 429, 500, 502, 503, 504];
  return temporaryStatusCodes.includes(error.statusCode);
}

/**
 * Determina se erro é de autenticação (requer logout)
 */
export function isAuthError(error: unknown): boolean {
  if (!isApiError(error)) {
    return false;
  }

  return error.statusCode === 401;
}

/**
 * Classe de erro customizada para problemas de rede
 */
export class NetworkError extends Error {
  constructor(message: string = 'Erro de rede') {
    super(message);
    this.name = 'NetworkError';
  }
}

/**
 * Classe de erro customizada para validação
 */
export class ValidationError extends Error {
  public fields: Record<string, string>;

  constructor(message: string, fields: Record<string, string> = {}) {
    super(message);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
