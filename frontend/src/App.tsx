import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { LoadingProvider } from './contexts/LoadingContext';
import { PrivateRoute } from './components/PrivateRoute';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useRouteCache } from './hooks/useRouteCache';
import './App.css';

// Lazy loading das páginas para reduzir bundle inicial
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Componente de loading para Suspense
const LoadingScreen = () => (
  <LoadingSpinner 
    size="large" 
    message="Carregando aplicação..." 
    fullScreen 
  />
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
      <LoadingProvider>
        <AuthProvider>
          <Suspense fallback={<LoadingScreen />}>
            <AppRoutes />
          </Suspense>
        </AuthProvider>
      </LoadingProvider>
    </BrowserRouter>
  );
}

export default App;
