import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../services/api';
import type { ApiError } from '../types';
import './Login.css';

interface FormErrors {
  email?: string;
  password?: string;
}

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');

  // Verificar se usuário já está logado
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Redirecionar para perfil se já tem token
      navigate('/profile');
    }
  }, [navigate]);

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

    // Limpar erro da API
    setApiError('');

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

    // Se houver erros, não enviar
    if (emailError || passwordError) {
      return;
    }

    // Enviar para API
    setIsLoading(true);

    try {
      const response = await ApiService.login(formData.email, formData.password);

      console.log('Login bem-sucedido!', response);
      
      // Salvar token no localStorage
      if (response.accessToken) {
        localStorage.setItem('token', response.accessToken);
      }

      // Redirecionar para perfil
      navigate('/profile');
    } catch (error) {
      const apiError = error as ApiError;
      
      // Tratar mensagens de erro
      let errorMessage = 'Erro ao fazer login. Tente novamente.';
      
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
    <div className="login-container">
      <div className="login-card">
        <h1>Entrar</h1>
        <p className="login-subtitle">
          Acesse sua conta para ver sua pontuação
        </p>
        
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {apiError && (
            <div className="api-error">
              {apiError}
            </div>
          )}

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
            />
            {touched.password && errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="form-footer">
            Não tem uma conta? <a href="/register">Cadastre-se</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
