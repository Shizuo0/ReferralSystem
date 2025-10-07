/**
 * Utilitários de autenticação
 */

/**
 * Decodifica um token JWT e retorna o payload
 */
export function decodeJWT(token: string): any | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Erro ao decodificar JWT:', error);
    return null;
  }
}

/**
 * Verifica se um token JWT está expirado
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  
  if (!payload || !payload.exp) {
    return true; // Token inválido ou sem expiração
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

/**
 * Verifica se o usuário está autenticado
 * @param token - Token JWT
 * @returns true se autenticado, false caso contrário
 */
export function isAuthenticated(token: string | null): boolean {
  if (!token) return false;
  if (isTokenExpired(token)) return false;
  return true;
}

/**
 * Obtém informações do usuário do token JWT
 */
export function getUserFromToken(token: string): { id: string; email: string } | null {
  const payload = decodeJWT(token);
  
  if (!payload) return null;
  
  return {
    id: payload.sub || '',
    email: payload.email || '',
  };
}
