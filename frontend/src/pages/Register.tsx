import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { ApiError } from '../types';
import { clearAllCache, clearCacheKeepToken } from '../utils/cache';
import './Register.css';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

function Register() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { register: registerUser, isAuthenticated } = useAuth();
  const referralCodeFromUrl = searchParams.get('ref');

  // Redirecionar se já está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    } else if (referralCodeFromUrl) {
      // Se há código de indicação, limpar cache para evitar conflitos
      clearAllCache();
    }
  }, [isAuthenticated, navigate, referralCodeFromUrl]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [referralInfo, setReferralInfo] = useState<string>('');

  // Capturar código de indicação da URL
  useEffect(() => {
    if (referralCodeFromUrl) {
      setReferralInfo(`Você foi indicado por alguém! Código: ${referralCodeFromUrl}`);
    }
  }, [referralCodeFromUrl]);

  // Validação de email
  const validateEmail = (email: string): string | undefined => {
    if (!email) {
      return 'Email é obrigatório';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Email deve ser válido';
    }
    return undefined;
  };

  // Validação de senha
  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return 'Senha é obrigatória';
    }
    if (password.length < 8) {
      return 'Senha deve ter no mínimo 8 caracteres';
    }
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    if (!hasLetter || !hasNumber) {
      return 'Senha deve conter letras e números';
    }
    return undefined;
  };

  // Validação de nome
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) {
      return 'Nome é obrigatório';
    }
    if (name.trim().length < 3) {
      return 'Nome deve ter no mínimo 3 caracteres';
    }
    return undefined;
  };

  // Validar campo específico
  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        return validateName(value);
      case 'email':
        return validateEmail(value);
      case 'password':
        return validatePassword(value);
      default:
        return undefined;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpar erro quando o usuário começa a digitar
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    // Limpar erro da API quando usuário digita
    if (apiError) {
      setApiError('');
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Limpar erro e mensagem de sucesso da API
    setApiError('');
    setSuccessMessage('');
    
    // Limpar dados antigos de cache antes de criar nova conta
    clearCacheKeepToken();

    // Marcar todos os campos como touched
    setTouched({
      name: true,
      email: true,
      password: true
    });

    // Validar todos os campos
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    const newErrors: FormErrors = {
      name: nameError,
      email: emailError,
      password: passwordError
    };

    setErrors(newErrors);

    // Se houver erros, não enviar
    if (nameError || emailError || passwordError) {
      return;
    }

    // Enviar para API
    setIsLoading(true);

    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        referralCode: referralCodeFromUrl || undefined,
      });

      // AuthContext já salva o token e atualiza o estado
      // Mostrar mensagem de sucesso e redirecionar
      setSuccessMessage(`✓ Conta criada com sucesso! Bem-vindo(a), ${formData.name}!`);
      
      // Redirecionar para perfil após 1.5 segundos
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (error) {
      const apiError = error as ApiError;
      
      // Tratar mensagens de erro
      let errorMessage = 'Erro ao criar conta. Tente novamente.';
      
      if (apiError.message) {
        if (Array.isArray(apiError.message)) {
          errorMessage = apiError.message.join(', ');
        } else {
          errorMessage = apiError.message;
        }
      }
      
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Criar Conta</h1>
        <p className="register-subtitle">
          Cadastre-se e comece a ganhar pontos por indicações
        </p>

        {referralInfo && (
          <div className="referral-info">
            🎉 {referralInfo}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="register-form" noValidate>
          {successMessage && (
            <div className="api-success">
              {successMessage}
            </div>
          )}

          {apiError && (
            <div className="api-error">
              {apiError}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Nome Completo</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Digite seu nome completo"
              className={touched.name && errors.name ? 'input-error' : ''}
              autoComplete="name"
            />
            {touched.name && errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="seu@email.com"
              className={touched.email && errors.email ? 'input-error' : ''}
              autoComplete="email"
            />
            {touched.email && errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Mínimo 8 caracteres"
              className={touched.password && errors.password ? 'input-error' : ''}
              autoComplete="new-password"
            />
            {touched.password && errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
            {!errors.password && (
              <small className="form-hint">
                A senha deve ter no mínimo 8 caracteres, com letras e números
              </small>
            )}
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="button-spinner"></span>
                Criando conta...
              </>
            ) : (
              'Criar Conta'
            )}
          </button>

          <p className="form-footer">
            Já tem uma conta? <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Faça login</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
