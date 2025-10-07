import { useState } from 'react';
import './Login.css';

interface FormErrors {
  email?: string;
  password?: string;
}

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

    // Integração com API será adicionada no próximo commit
    console.log('Login data:', formData);
  };

  return (
    <div className="login-container">
      <div className="login-card">
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

          <button type="submit" className="submit-button">
            Entrar
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
