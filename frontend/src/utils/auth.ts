/**
 * Utilitários de autenticação
 * Com tratamento robusto de edge cases
 */

/**
 * Decodifica um token JWT e retorna o payload
 * @param token - Token JWT para decodificar
 * @returns Payload do token ou null se inválido
 */
export function decodeJWT(token: string): any | null {
  // Validar input
  if (!token || typeof token !== 'string' || token.trim() === '') {
    console.warn('Token vazio ou inválido fornecido para decodeJWT');
    return null;
  }

  try {
    // JWT deve ter 3 partes separadas por '.'
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('Token JWT mal formatado (não tem 3 partes)');
      return null;
    }

    const base64Url = parts[1];
    if (!base64Url) {
      console.warn('Payload do token JWT está vazio');
      return null;
    }
    
    // Decodificar base64url para base64
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decodificar base64 para string
    let jsonPayload: string;
    try {
      jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    } catch (e) {
      console.error('Erro ao decodificar base64 do token:', e);
      return null;
    }

    // Parse JSON
    try {
      const payload = JSON.parse(jsonPayload);
      
      // Validar se é um objeto
      if (!payload || typeof payload !== 'object') {
        console.warn('Payload do token não é um objeto válido');
        return null;
      }
      
      return payload;
    } catch (e) {
      console.error('Erro ao fazer parse do JSON do token:', e);
      return null;
    }
  } catch (error) {
    console.error('Erro inesperado ao decodificar JWT:', error);
    return null;
  }
}

/**
 * Verifica se um token JWT está expirado
 * @param token - Token JWT para verificar
 * @returns true se expirado ou inválido, false se válido
 */
export function isTokenExpired(token: string): boolean {
  // Validar input
  if (!token || typeof token !== 'string' || token.trim() === '') {
    return true;
  }

  const payload = decodeJWT(token);
  
  if (!payload) {
    return true; // Token inválido
  }

  // Verificar se tem campo 'exp'
  if (!payload.exp || typeof payload.exp !== 'number') {
    console.warn('Token JWT sem campo de expiração válido');
    return true; // Sem expiração = consideramos inválido
  }

  // Verificar expiração com margem de segurança de 10 segundos
  const currentTime = Math.floor(Date.now() / 1000);
  const expirationBuffer = 10; // 10 segundos de margem
  
  return payload.exp < (currentTime + expirationBuffer);
}

/**
 * Verifica se o usuário está autenticado
 * @param token - Token JWT
 * @returns true se autenticado, false caso contrário
 */
export function isAuthenticated(token: string | null): boolean {
  if (!token) {
    return false;
  }
  
  if (typeof token !== 'string' || token.trim() === '') {
    return false;
  }
  
  if (isTokenExpired(token)) {
    return false;
  }
  
  return true;
}

/**
 * Obtém informações do usuário do token JWT
 * @param token - Token JWT
 * @returns Dados do usuário ou null se inválido
 */
export function getUserFromToken(token: string): { id: string; email: string; name?: string } | null {
  // Validar input
  if (!token || typeof token !== 'string' || token.trim() === '') {
    return null;
  }

  const payload = decodeJWT(token);
  
  if (!payload) {
    return null;
  }
  
  // Validar campos obrigatórios
  if (!payload.sub && !payload.id) {
    console.warn('Token JWT sem ID do usuário (sub ou id)');
    return null;
  }
  
  if (!payload.email || typeof payload.email !== 'string') {
    console.warn('Token JWT sem email válido');
    return null;
  }
  
  return {
    id: payload.sub || payload.id || '',
    email: payload.email || '',
    name: payload.name || undefined,
  };
}

/**
 * Valida se um token JWT tem a estrutura básica correta
 * @param token - Token JWT para validar
 * @returns true se estrutura é válida, false caso contrário
 */
export function isValidJWTStructure(token: string): boolean {
  if (!token || typeof token !== 'string' || token.trim() === '') {
    return false;
  }

  const parts = token.split('.');
  
  // JWT deve ter exatamente 3 partes
  if (parts.length !== 3) {
    return false;
  }

  // Verificar se cada parte não está vazia
  if (!parts[0] || !parts[1] || !parts[2]) {
    return false;
  }

  // Verificar se é base64url válido (regex simples)
  const base64UrlRegex = /^[A-Za-z0-9_-]+$/;
  return parts.every(part => base64UrlRegex.test(part));
}

/**
 * Extrai o tempo restante até expiração do token em segundos
 * @param token - Token JWT
 * @returns Segundos até expiração ou 0 se expirado/inválido
 */
export function getTokenTimeToLive(token: string): number {
  if (!token || !isValidJWTStructure(token)) {
    return 0;
  }

  const payload = decodeJWT(token);
  
  if (!payload || !payload.exp || typeof payload.exp !== 'number') {
    return 0;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const timeToLive = payload.exp - currentTime;
  
  return Math.max(0, timeToLive);
}
