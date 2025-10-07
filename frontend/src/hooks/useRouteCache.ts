import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook que limpa cache de dados antigos ao mudar de rota
 * Mantém apenas o token de autenticação
 */
export const useRouteCache = () => {
  const location = useLocation();

  useEffect(() => {
    // Salvar token antes de limpar
    const token = localStorage.getItem('token');
    
    // Limpar apenas dados de cache (não o token)
    // Remove qualquer dado antigo de profile/user
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key !== 'token' && key !== 'lastCacheClear') {
        keysToRemove.push(key);
      }
    }
    
    // Remover keys antigas
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Se tinha token, restaurar
    if (token) {
      localStorage.setItem('token', token);
    }
    
    // Log apenas em desenvolvimento
    if (import.meta.env.DEV) {
      console.log(`🔄 Cache de dados limpo - Rota: ${location.pathname}`);
    }
  }, [location.pathname]); // Executa toda vez que muda de rota
};
