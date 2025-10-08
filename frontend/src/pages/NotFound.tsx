import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import './NotFound.css';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <Logo size="medium" />
        <h1 className="not-found-title">404</h1>
        <p className="not-found-subtitle">Página não encontrada</p>
        <p className="not-found-description">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="not-found-actions">
          <button 
            onClick={() => navigate('/login')}
            className="btn btn-primary"
          >
            Ir para Login
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="btn btn-secondary"
          >
            Criar Conta
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;