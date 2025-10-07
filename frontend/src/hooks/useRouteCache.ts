import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { clearCacheKeepToken } from '../utils/cache';

/**
 * Hook que limpa cache de dados antigos ao mudar de rota
 * Mantém apenas o token de autenticação
 */
export const useRouteCache = () => {
  const location = useLocation();

  useEffect(() => {
    // Limpar cache mantendo token usando função utilitária
    clearCacheKeepToken();
    
    // Log adicional com a rota em dev mode
    if (import.meta.env.DEV) {
      console.log(`📍 Rota: ${location.pathname}`);
    }
  }, [location.pathname]); // Executa toda vez que muda de rota
};