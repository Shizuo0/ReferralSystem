import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../services/api';
import type { ApiError } from '../types';
import { clearAllCache, getAuthToken } from '../utils/cache';
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
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const token = getAuthToken();

      if (!token) {
        navigate('/login');
        return;
      }

      // Limpar dados antigos de profile antes de carregar novo
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key !== 'token' && key !== 'lastCacheClear') {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));

      try {
        const data = await ApiService.getProfile(token);
        setProfile(data);
      } catch (error) {
        const apiError = error as ApiError;
        
        // Tratar mensagem de erro (pode ser string ou array)
        let errorMessage = 'Erro ao carregar perfil';
        if (apiError.message) {
          if (Array.isArray(apiError.message)) {
            errorMessage = apiError.message.join(', ');
          } else {
            errorMessage = apiError.message;
          }
        }
        
        setError(errorMessage);
        
        // Se token inválido ou usuário não encontrado, limpar e redirecionar
        if (apiError.statusCode === 401 || apiError.statusCode === 404) {
          clearAllCache();
          setTimeout(() => {
            navigate('/login');
          }, 1000);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleCopyLink = async () => {
    if (!profile) return;

    try {
      await navigator.clipboard.writeText(profile.referralLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar link:', err);
    }
  };

  const handleLogout = () => {
    clearAllCache();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <p className="loading-text">Carregando perfil...</p>
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
            <button onClick={() => navigate('/login')} className="error-button">
              Ir para Login
            </button>
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
          <h1>Meu Perfil</h1>
          <button onClick={handleLogout} className="logout-button">
            Sair
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
            />
            <button 
              onClick={handleCopyLink} 
              className={`copy-button ${copySuccess ? 'copied' : ''}`}
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
    </div>
  );
}

export default Profile;
