/**
 * Utilitário para gerenciamento de cache e sessão
 * Com tratamento robusto de edge cases
 */

/**
 * Verifica se localStorage está disponível
 */
const isLocalStorageAvailable = (): boolean => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Verifica se sessionStorage está disponível
 */
const isSessionStorageAvailable = (): boolean => {
  try {
    const test = '__sessionStorage_test__';
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Limpa completamente o cache do navegador
 * Remove: localStorage, sessionStorage e cookies
 * @param silent - Se true, não exibe log no console
 */
export const clearAllCache = (silent: boolean = false): void => {
  try {
    // Guardar sessionStorage items que devem persistir
    let itemsToKeep: Record<string, string | null> = {};
    
    if (isSessionStorageAvailable()) {
      itemsToKeep = {
        lastCacheClear: sessionStorage.getItem('lastCacheClear'),
      };
    }
    
    // Limpar localStorage
    if (isLocalStorageAvailable()) {
      try {
        localStorage.clear();
      } catch (e) {
        console.error('Erro ao limpar localStorage:', e);
      }
    }
    
    // Limpar sessionStorage
    if (isSessionStorageAvailable()) {
      try {
        sessionStorage.clear();
      } catch (e) {
        console.error('Erro ao limpar sessionStorage:', e);
      }
      
      // Restaurar items que devem persistir
      if (itemsToKeep.lastCacheClear) {
        try {
          sessionStorage.setItem('lastCacheClear', itemsToKeep.lastCacheClear);
        } catch (e) {
          console.error('Erro ao restaurar sessionStorage:', e);
        }
      }
    }
    
    // Limpar todos os cookies
    try {
      document.cookie.split(";").forEach((cookie) => {
        const cookieName = cookie.split("=")[0].trim();
        if (cookieName) {
          document.cookie = `${cookieName}=;expires=${new Date(0).toUTCString()};path=/`;
        }
      });
    } catch (e) {
      console.error('Erro ao limpar cookies:', e);
    }
    
    if (!silent) {
      console.log('🧹 Cache completamente limpo');
    }
  } catch (e) {
    console.error('Erro ao limpar cache:', e);
  }
};

/**
 * Verifica se há uma sessão ativa
 * @returns true se houver token no localStorage
 */
export const hasActiveSession = (): boolean => {
  if (!isLocalStorageAvailable()) {
    return false;
  }
  
  try {
    return !!localStorage.getItem('token');
  } catch (e) {
    console.error('Erro ao verificar sessão ativa:', e);
    return false;
  }
};

/**
 * Limpa cache mas mantém o token de autenticação
 * Útil para limpar dados antigos sem fazer logout
 */
export const clearCacheKeepToken = (): void => {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage não disponível');
    return;
  }
  
  try {
    const token = localStorage.getItem('token');
    let lastCacheClear: string | null = null;
    
    if (isSessionStorageAvailable()) {
      lastCacheClear = sessionStorage.getItem('lastCacheClear');
    }
    
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key !== 'token') {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error(`Erro ao remover key ${key}:`, e);
      }
    });
    
    // Restaurar items importantes
    if (token) {
      try {
        localStorage.setItem('token', token);
      } catch (e) {
        console.error('Erro ao restaurar token:', e);
      }
    }
    
    if (lastCacheClear && isSessionStorageAvailable()) {
      try {
        sessionStorage.setItem('lastCacheClear', lastCacheClear);
      } catch (e) {
        console.error('Erro ao restaurar lastCacheClear:', e);
      }
    }
    
    if (import.meta.env.DEV) {
      console.log('🔄 Cache de dados limpo (token preservado)');
    }
  } catch (e) {
    console.error('Erro ao limpar cache mantendo token:', e);
  }
};

/**
 * Obtém o token de autenticação
 * @returns token ou null se não existir
 */
export const getAuthToken = (): string | null => {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage não disponível');
    return null;
  }
  
  try {
    const token = localStorage.getItem('token');
    return token && token.trim() !== '' ? token : null;
  } catch (e) {
    console.error('Erro ao obter token:', e);
    return null;
  }
};

/**
 * Salva o token de autenticação
 * @param token Token JWT para salvar
 */
export const setAuthToken = (token: string): void => {
  if (!token || token.trim() === '') {
    console.warn('Tentativa de salvar token vazio');
    return;
  }
  
  if (!isLocalStorageAvailable()) {
    console.error('localStorage não disponível - não é possível salvar token');
    return;
  }
  
  try {
    localStorage.setItem('token', token);
    if (import.meta.env.DEV) {
      console.log('✓ Token de autenticação salvo');
    }
  } catch (e) {
    console.error('Erro ao salvar token:', e);
    
    // Se localStorage está cheio, tentar limpar cache antigo
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      console.warn('localStorage cheio, limpando cache...');
      clearCacheKeepToken();
      
      // Tentar salvar novamente
      try {
        localStorage.setItem('token', token);
      } catch (retryError) {
        console.error('Falha ao salvar token mesmo após limpar cache:', retryError);
      }
    }
  }
};

/**
 * Remove o token de autenticação
 */
export const removeAuthToken = (): void => {
  if (!isLocalStorageAvailable()) {
    return;
  }
  
  try {
    localStorage.removeItem('token');
    if (import.meta.env.DEV) {
      console.log('✓ Token removido');
    }
  } catch (e) {
    console.error('Erro ao remover token:', e);
  }
};
