import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuthToken } from '../utils/cache';

interface PrivateRouteProps {
  children: ReactNode;
}

/**
 * Componente de rota protegida
 * Redireciona para /login se não houver token de autenticação
 */
export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = getAuthToken();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};