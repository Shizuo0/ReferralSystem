import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { clearAllCache } from './utils/cache'

// Limpar cache automaticamente ao iniciar o servidor
// Garante estado limpo em cada inicialização
const isDevelopment = import.meta.env.DEV;

if (isDevelopment) {
  // Em desenvolvimento, sempre limpar cache ao iniciar
  clearAllCache();
  console.log('🧹 Cache limpo automaticamente (modo desenvolvimento)');
} else {
  // Em produção, limpar apenas se houver token antigo sem refresh recente
  const lastClear = sessionStorage.getItem('lastCacheClear');
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  if (!lastClear || (now - parseInt(lastClear)) > oneHour) {
    clearAllCache();
    sessionStorage.setItem('lastCacheClear', now.toString());
    console.log('🧹 Cache limpo automaticamente');
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
