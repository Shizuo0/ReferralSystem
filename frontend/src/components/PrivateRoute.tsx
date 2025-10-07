import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAuthToken, clearAllCache } from '../utils/cache';

interface PrivateRouteProps {
  children: ReactNode;
}

/**
 * Componente de rota protegida
 * - Valida se o usuário está autenticado
 * - Redireciona para /login se não houver token válido
 * - Mostra loading enquanto valida o token
 * - Preserva a localização para redirect após login
 */
export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      const token = getAuthToken();
      
      if (!token) {
        setIsAuthenticated(false);
        setIsValidating(false);
        return;
      }

      try {
        // Decodificar JWT para verificar expiração
        const tokenPayload = parseJWT(token);
        
        if (!tokenPayload) {
          // Token inválido
          clearAllCache(true);
          setIsAuthenticated(false);
          setIsValidating(false);
          return;
        }

        // Verificar se o token expirou
        const currentTime = Math.floor(Date.now() / 1000);
        if (tokenPayload.exp && tokenPayload.exp < currentTime) {
          // Token expirado
          clearAllCache(true);
          setIsAuthenticated(false);
          setIsValidating(false);
          return;
        }

        // Token válido
        setIsAuthenticated(true);
        setIsValidating(false);
      } catch (error) {
        console.error('Erro ao validar token:', error);
        clearAllCache(true);
        setIsAuthenticated(false);
        setIsValidating(false);
      }
    };

    validateToken();
  }, []);

  // Loading state enquanto valida
  if (isValidating) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        gap: '16px',
      }}>
        <div className="spinner-large" style={{
          width: '48px',
          height: '48px',
          border: '4px solid rgba(139, 92, 246, 0.2)',
          borderTopColor: 'var(--primary-color)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}></div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Verificando autenticação...
        </p>
      </div>
    );
  }

  // Não autenticado - redirecionar para login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Autenticado - renderizar children
  return <>{children}</>;
};

/**
 * Função auxiliar para decodificar JWT
 * Retorna o payload do token ou null se inválido
 */
function parseJWT(token: string): { exp?: number; sub?: string; email?: string } | null {
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
