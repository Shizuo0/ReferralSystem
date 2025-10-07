import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  loadingMessage: string;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
  setLoadingMessage: (message: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Carregando...');

  const startLoading = useCallback((message?: string) => {
    setIsLoading(true);
    if (message) {
      setLoadingMessage(message);
    }
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingMessage('Carregando...');
  }, []);

  const updateLoadingMessage = useCallback((message: string) => {
    setLoadingMessage(message);
  }, []);

  const value: LoadingContextType = {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
    setLoadingMessage: updateLoadingMessage,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {isLoading && <GlobalLoadingOverlay message={loadingMessage} />}
    </LoadingContext.Provider>
  );
}

/**
 * Hook para usar o contexto de loading global
 */
export function useLoading() {
  const context = useContext(LoadingContext);
  
  if (context === undefined) {
    throw new Error('useLoading deve ser usado dentro de um LoadingProvider');
  }
  
  return context;
}

/**
 * Componente de overlay de loading global
 */
function GlobalLoadingOverlay({ message }: { message: string }) {
  return (
    <div className="global-loading-overlay">
      <div className="global-loading-content">
        <div className="global-loading-spinner"></div>
        <p className="global-loading-message">{message}</p>
      </div>
    </div>
  );
}
