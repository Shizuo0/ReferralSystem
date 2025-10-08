import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { clearCacheKeepToken } from '../utils/cache';
import { formatErrorMessage } from '../utils/errorHandler';
import Logo from '../components/Logo';
import './Login.css';

interface FormErrors {
  email?: string;
  password?: string;
}

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { showError, showWarning } = useToast();
  const sessionExpired = (location.state as any)?.sessionExpired;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Mostrar mensagem se sessão expirou
  useEffect(() => {
    if (sessionExpired) {
      showWarning('Sua sessão expirou. Por favor, faça login novamente.');
    }
  }, [sessionExpired, showWarning]);

  // Redirecionar se já está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      // Redirecionar para página original ou profile
      const from = (location.state as any)?.from?.pathname || '/profile';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

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
    return undefined;
  };

  // Validar campo específico
  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
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
    
    // Limpar dados antigos de cache (mantém apenas token se houver)
    clearCacheKeepToken();

    // Marcar todos os campos como touched
    setTouched({
      email: true,
      password: true
    });

    // Validar todos os campos
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    const newErrors: FormErrors = {
      email: emailError,
      password: passwordError
    };

    setErrors(newErrors);

    // Se houver erros, mostrar notificações toast
    if (emailError || passwordError) {
      if (emailError) {
        showError(emailError);
      }
      if (passwordError) {
        showError(passwordError);
      }
      return;
    }

    // Enviar para API
    setIsLoading(true);

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });

      // AuthContext já salva o token e atualiza o estado
      // Redirecionar para perfil
      navigate('/profile');
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <Logo size="large" />
        <h1>Entrar</h1>
        <p className="login-subtitle">
          Acesse sua conta para ver sua pontuação
        </p>
        
        <form onSubmit={handleSubmit} className="login-form" noValidate>
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
              placeholder="Digite sua senha"
              className={touched.password && errors.password ? 'input-error' : ''}
              autoComplete="current-password"
            />
            {touched.password && errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="button-spinner"></span>
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>

          <p className="form-footer">
            Não tem uma conta? <a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Cadastre-se</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
