import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { useRouteCache } from './hooks/useRouteCache';
import './App.css';

// Lazy loading das páginas para reduzir bundle inicial
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Componente de loading aprimorado
const LoadingScreen = () => (
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
    <p style={{ 
      color: 'var(--text-secondary)', 
      fontSize: '14px',
      animation: 'pulse 2s ease-in-out infinite',
    }}>
      Carregando aplicação...
    </p>
  </div>
);

// Wrapper que limpa cache ao mudar de rota
function AppRoutes() {
  useRouteCache(); // Limpa cache de dados antigos a cada mudança de rota
  
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" replace />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route 
        path="/profile" 
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingScreen />}>
          <AppRoutes />
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
