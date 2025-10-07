/**
 * Utilitários para sanitização de inputs
 * Protege contra XSS e outros ataques
 */

/**
 * Remove caracteres perigosos de inputs
 * @param input String para sanitizar
 * @returns String sanitizada
 */
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < e >
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+=/gi, '') // Remove event handlers (onclick=, onerror=, etc)
    .substring(0, 500); // Limite de caracteres
};

/**
 * Sanitiza email
 * @param email Email para sanitizar
 * @returns Email sanitizado
 */
export const sanitizeEmail = (email: string): string => {
  return email
    .trim()
    .toLowerCase()
    .replace(/[<>]/g, '')
    .substring(0, 254); // RFC 5321 - tamanho máximo de email
};

/**
 * Sanitiza senha (apenas trim e limite)
 * Não remove caracteres especiais pois são permitidos em senhas
 * @param password Senha para sanitizar
 * @returns Senha sanitizada
 */
export const sanitizePassword = (password: string): string => {
  return password.substring(0, 128); // Limite razoável para senha
};

/**
 * Sanitiza nome
 * @param name Nome para sanitizar
 * @returns Nome sanitizado
 */
export const sanitizeName = (name: string): string => {
  return name
    .trim()
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ') // Normaliza espaços múltiplos
    .substring(0, 255);
};