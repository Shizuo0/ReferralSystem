/**
 * Utilitário para gerenciamento de cache e sessão
 */

/**
 * Limpa completamente o cache do navegador
 * Remove: localStorage, sessionStorage e cookies
 * @param silent - Se true, não exibe log no console
 */
export const clearAllCache = (silent: boolean = false): void => {
  // Guardar sessionStorage items que devem persistir
  const itemsToKeep = {
    lastCacheClear: sessionStorage.getItem('lastCacheClear'),
  };
  
  // Limpar localStorage
  localStorage.clear();
  
  // Limpar sessionStorage
  sessionStorage.clear();
  
  // Restaurar items que devem persistir
  if (itemsToKeep.lastCacheClear) {
    sessionStorage.setItem('lastCacheClear', itemsToKeep.lastCacheClear);
  }
  
  // Limpar todos os cookies
  document.cookie.split(";").forEach((cookie) => {
    document.cookie = cookie
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
  
  if (!silent) {
    console.log('🧹 Cache completamente limpo');
  }
};

/**
 * Verifica se há uma sessão ativa
 * @returns true se houver token no localStorage
 */
export const hasActiveSession = (): boolean => {
  return !!localStorage.getItem('token');
};

/**
 * Limpa apenas o token de autenticação
 */
export const clearAuthToken = (): void => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  console.log('🔐 Token de autenticação removido');
};

/**
 * Obtém o token de autenticação
 * @returns token ou null se não existir
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Salva o token de autenticação
 * @param token Token JWT para salvar
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem('token', token);
  console.log('✓ Token de autenticação salvo');
};