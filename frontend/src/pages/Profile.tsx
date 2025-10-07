import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { ApiService } from '../services/api';
import { clearCacheKeepToken, getAuthToken } from '../utils/cache';
import { formatErrorMessage } from '../utils/errorHandler';
import { ProfileSkeleton } from '../components/SkeletonLoader';
import './Profile.css';

interface ProfileData {
  id: string;
  name: string;
  email: string;
  score: number;
  referralCode: string;
  referralLink: string;
  createdAt: string;
}

function Profile() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const token = getAuthToken();
      
      if (!token) {
        logout();
        return;
      }

      // Limpar dados antigos de profile antes de carregar novo
      clearCacheKeepToken();

      try {
        const data = await ApiService.getProfile(token);
        setProfile(data);
      } catch (error) {
        const errorMessage = formatErrorMessage(error);
        setError(errorMessage);
        showError(errorMessage);
        
        // Se erro de autenticação, fazer logout
        const apiError = error as any;
        if (apiError.statusCode === 401 || apiError.statusCode === 404) {
          setTimeout(() => {
            logout();
          }, 1500);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [logout, showError]);

  const handleCopyLink = useCallback(async () => {
    if (!profile) return;

    try {
      await navigator.clipboard.writeText(profile.referralLink);
      setCopySuccess(true);
      showSuccess('Link copiado para área de transferência!');
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar link:', err);
      showError('Não foi possível copiar o link. Tente novamente.');
    }
  }, [profile, showSuccess, showError]);

  const handleLogoutClick = useCallback(() => {
    setShowLogoutConfirm(true);
  }, []);

  const handleLogoutConfirm = useCallback(() => {
    logout();
  }, [logout]);

  const handleLogoutCancel = useCallback(() => {
    setShowLogoutConfirm(false);
  }, []);

  if (isLoading) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div className="error-message">
            <p>{error}</p>
            {error.includes('401') || error.includes('404') ? (
              <p className="error-hint">Redirecionando para login...</p>
            ) : (
              <button onClick={() => navigate('/login')} className="error-button">
                Ir para Login
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div>
            <h1>Meu Perfil</h1>
            {user && (
              <p className="user-badge">
                <span className="badge-icon">👤</span>
                {user.email}
              </p>
            )}
          </div>
          <button onClick={handleLogoutClick} className="logout-button" title="Sair da conta">
            <span className="logout-icon">🚪</span> Sair
          </button>
        </div>

        <div className="profile-info">
          <div className="info-item">
            <span className="info-label">Nome:</span>
            <span className="info-value">{profile.name}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{profile.email}</span>
          </div>
        </div>

        <div className="score-section">
          <div className="score-card">
            <span className="score-label">Sua Pontuação</span>
            <span className="score-value">{profile.score}</span>
            <span className="score-hint">
              {profile.score === 0 
                ? 'Compartilhe seu link para ganhar pontos!' 
                : `Você já indicou ${profile.score} pessoa${profile.score > 1 ? 's' : ''}!`}
            </span>
          </div>
        </div>

        <div className="referral-section">
          <h2>Seu Link de Indicação</h2>
          <p className="referral-description">
            Compartilhe este link com seus amigos. A cada pessoa que se cadastrar usando seu link, você ganha +1 ponto!
          </p>

          <div className="referral-link-container">
            <input 
              type="text" 
              value={profile.referralLink} 
              readOnly 
              className="referral-link-input"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button 
              onClick={handleCopyLink} 
              className={`copy-button ${copySuccess ? 'copied' : ''}`}
              title="Copiar link de indicação"
            >
              {copySuccess ? '✓ Copiado!' : 'Copiar Link'}
            </button>
          </div>

          {copySuccess && (
            <p className="copy-success-message">
              ✓ Link copiado! Agora é só compartilhar.
            </p>
          )}
        </div>
      </div>

      {/* Modal de confirmação de logout */}
      {showLogoutConfirm && (
        <div className="modal-overlay" onClick={handleLogoutCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Confirmar Logout</h3>
            <p>Tem certeza que deseja sair?</p>
            <div className="modal-actions">
              <button onClick={handleLogoutCancel} className="modal-button cancel">
                Cancelar
              </button>
              <button onClick={handleLogoutConfirm} className="modal-button confirm">
                Sim, sair
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
