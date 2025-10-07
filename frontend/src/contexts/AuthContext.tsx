import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../services/api';
import { getAuthToken, setAuthToken, clearAllCache } from '../utils/cache';
import { isTokenExpired, getUserFromToken } from '../utils/auth';
import type { RegisterData, LoginData } from '../types';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Intervalo de verificação de expiração de token (a cada 1 minuto)
const TOKEN_CHECK_INTERVAL = 60000;

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const checkIntervalRef = useRef<number | null>(null);

  // Verificar se há token válido e extrair dados do usuário
  const checkAuth = useCallback(() => {
    const token = getAuthToken();
    
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return false;
    }

    // Verificar se token expirou
    if (isTokenExpired(token)) {
      console.warn('Token expirado, limpando sessão');
      clearAllCache(true);
      setUser(null);
      setIsLoading(false);
      return false;
    }

    // Extrair dados do usuário do token
    const userData = getUserFromToken(token);
    if (userData) {
      setUser(userData);
      setIsLoading(false);
      return true;
    }

    setUser(null);
    setIsLoading(false);
    return false;
  }, []);

  // Verificar autenticação ao carregar a aplicação
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Verificação periódica de expiração de token
  useEffect(() => {
    // Limpar intervalo anterior se existir
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
    }

    // Configurar nova verificação periódica
    checkIntervalRef.current = setInterval(() => {
      const token = getAuthToken();
      
      if (token && isTokenExpired(token)) {
        console.warn('Token expirou durante a sessão');
        clearAllCache(true);
        setUser(null);
        
        // Redirecionar para login se estiver em página protegida
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          navigate('/login', { state: { sessionExpired: true } });
        }
      }
    }, TOKEN_CHECK_INTERVAL);

    // Cleanup ao desmontar
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [navigate]);

  // Sincronizar estado entre abas (storage event)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Se o token foi removido em outra aba
      if (e.key === 'token' && !e.newValue && user) {
        console.log('Token removido em outra aba, fazendo logout');
        setUser(null);
        navigate('/login');
      }
      
      // Se o token foi adicionado em outra aba
      if (e.key === 'token' && e.newValue && !user) {
        console.log('Token adicionado em outra aba, atualizando estado');
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user, navigate, checkAuth]);

  // Listener para quando a aba fica visível novamente
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Re-verificar autenticação quando a aba volta a ficar visível
        const token = getAuthToken();
        if (token && isTokenExpired(token)) {
          console.warn('Token expirou enquanto aba estava inativa');
          clearAllCache(true);
          setUser(null);
          navigate('/login', { state: { sessionExpired: true } });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [navigate]);

  // Função de login
  const login = async (data: LoginData) => {
    try {
      const response = await ApiService.login(data.email, data.password);
      
      if (response.accessToken) {
        setAuthToken(response.accessToken);
        
        // Extrair dados do usuário do token
        const userData = getUserFromToken(response.accessToken);
        if (userData) {
          setUser(userData);
        }
        
        // Navegação será feita pela página
      }
    } catch (error) {
      // Propagar erro para a página tratar
      throw error;
    }
  };

  // Função de registro
  const register = async (data: RegisterData) => {
    try {
      const response = await ApiService.register(data);
      
      if (response.accessToken) {
        setAuthToken(response.accessToken);
        
        // Extrair dados do usuário do token
        const userData = getUserFromToken(response.accessToken);
        if (userData) {
          setUser(userData);
        }
        
        // Navegação será feita pela página
      }
    } catch (error) {
      // Propagar erro para a página tratar
      throw error;
    }
  };

  // Função de logout
  const logout = useCallback(() => {
    // Limpar intervalo de verificação
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }
    
    clearAllCache(true);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook personalizado para acessar o contexto de autenticação
 * @throws Error se usado fora do AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}
