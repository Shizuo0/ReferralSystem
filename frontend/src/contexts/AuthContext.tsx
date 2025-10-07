import { createContext, useContext, useState, useEffect } from 'react';
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

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Verificar autenticação ao carregar a aplicação
  useEffect(() => {
    checkAuth();
  }, []);

  // Verificar se há token válido e extrair dados do usuário
  const checkAuth = () => {
    const token = getAuthToken();
    
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    // Verificar se token expirou
    if (isTokenExpired(token)) {
      clearAllCache(true);
      setUser(null);
      setIsLoading(false);
      return;
    }

    // Extrair dados do usuário do token
    const userData = getUserFromToken(token);
    if (userData) {
      setUser(userData);
    }

    setIsLoading(false);
  };

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
  const logout = () => {
    clearAllCache(true);
    setUser(null);
    navigate('/login');
  };

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
