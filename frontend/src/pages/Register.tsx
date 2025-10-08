import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { clearAllCache, clearCacheKeepToken } from '../utils/cache';
import { formatErrorMessage } from '../utils/errorHandler';
import Logo from '../components/Logo';
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
  const { showSuccess, showError } = useToast();
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
  const [referralInfo, setReferralInfo] = useState<string>('');

  // Capturar código de indicação da URL
  useEffect(() => {
    if (referralCodeFromUrl) {
      setReferralInfo(`Você foi indicado por alguém! Código: ${referralCodeFromUrl}`);
    }
  }, [referralCodeFromUrl]);

  // Validação de email
  const validateEmail = (email: string): string | undefined => {
    if (!email || !email.trim()) {
      return 'Email é obrigatório';
    }
    
    const trimmedEmail = email.trim();
    
    if (trimmedEmail.length > 255) {
      return 'Email muito longo (máximo 255 caracteres)';
    }
    
    // Regex mais robusto para email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      return 'Email deve ser válido';
    }
    
    return undefined;
  };

  // Validação de senha
  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return 'Senha é obrigatória';
    }
    
    // Não permitir senha com apenas espaços
    if (password.trim() === '') {
      return 'Senha não pode conter apenas espaços';
    }
    
    if (password.length < 8) {
      return 'Senha deve ter no mínimo 8 caracteres';
    }
    
    if (password.length > 72) {
      return 'Senha muito longa (máximo 72 caracteres)';
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
    if (!name || !name.trim()) {
      return 'Nome é obrigatório';
    }
    
    const trimmedName = name.trim();
    
    if (trimmedName.length < 3) {
      return 'Nome deve ter no mínimo 3 caracteres';
    }
    
    if (trimmedName.length > 100) {
      return 'Nome muito longo (máximo 100 caracteres)';
    }
    
    // Validar caracteres válidos (letras, espaços, acentos, hífens)
    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmedName)) {
      return 'Nome contém caracteres inválidos';
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

    // Se houver erros, mostrar notificações toast
    if (nameError || emailError || passwordError) {
      if (nameError) {
        showError(nameError);
      }
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
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        referralCode: referralCodeFromUrl || undefined,
      });

      // Mostrar mensagem de sucesso
      const successMsg = `Conta criada com sucesso! Bem-vindo(a), ${formData.name}!`;
      showSuccess(successMsg);
      
      // Redirecionar para perfil após 1.5 segundos
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <Logo size="large" />
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
