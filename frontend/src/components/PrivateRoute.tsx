import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: ReactNode;
}

/**
 * Componente de rota protegida otimizado
 * - Usa o AuthContext para verificar autenticação
 * - Redireciona para /login se não houver autenticação
 * - Mostra loading enquanto valida o token
 * - Preserva a localização para redirect após login
 * - Sincronizado com o estado global de autenticação
 */
export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  // Loading state enquanto valida
  if (isLoading) {
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
