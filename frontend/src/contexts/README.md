# Contextos da Aplicação

Esta pasta contém os contextos React para gerenciamento de estado global.

## AuthContext

Gerencia o estado global de autenticação da aplicação.

### Funcionalidades

✅ **Estado Global**
- `user`: Dados do usuário autenticado
- `isAuthenticated`: Boolean indicando se está logado
- `isLoading`: Boolean para estado de carregamento inicial

✅ **Métodos**
- `login(data)`: Faz login e atualiza estado
- `register(data)`: Registra usuário e atualiza estado
- `logout()`: Faz logout e limpa tudo
- `checkAuth()`: Verifica/atualiza estado de autenticação

### Uso

#### 1. Configurar Provider (App.tsx)

```tsx
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Resto da aplicação */}
      </AuthProvider>
    </BrowserRouter>
  );
}
```

#### 2. Usar em Componentes

```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (isAuthenticated) {
    return <p>Olá, {user?.email}!</p>;
  }

  return <button onClick={() => login(data)}>Login</button>;
}
```

### Hook: useAuth()

Hook personalizado que retorna o contexto de autenticação.

**Retorna:**
```typescript
{
  user: User | null,              // Dados do usuário
  isAuthenticated: boolean,       // true se logado
  isLoading: boolean,             // true durante verificação inicial
  login: (data) => Promise<void>, // Função de login
  register: (data) => Promise<void>, // Função de registro
  logout: () => void,             // Função de logout
  checkAuth: () => void,          // Re-verificar autenticação
}
```

**Exemplo:**
```tsx
const { user, isAuthenticated, logout } = useAuth();

if (isAuthenticated) {
  return (
    <div>
      <p>Bem-vindo, {user?.email}</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```

### Métodos Detalhados

#### login(data: LoginData)

Faz login do usuário.

```tsx
const { login } = useAuth();

const handleLogin = async () => {
  try {
    await login({ email: 'user@test.com', password: 'senha123' });
    // Login bem-sucedido
    // Token salvo automaticamente
    // User state atualizado
    navigate('/profile');
  } catch (error) {
    // Tratar erro
    console.error(error);
  }
};
```

**Fluxo:**
1. Chama `ApiService.login()`
2. Recebe `accessToken` da API
3. Salva token com `setAuthToken()`
4. Extrai dados do usuário do token
5. Atualiza `user` state
6. Retorna (página faz navegação)

#### register(data: RegisterData)

Registra novo usuário.

```tsx
const { register } = useAuth();

const handleRegister = async () => {
  try {
    await register({
      name: 'João Silva',
      email: 'joao@test.com',
      password: 'senha123',
      referralCode: 'MARI1234' // opcional
    });
    // Registro bem-sucedido
    navigate('/profile');
  } catch (error) {
    // Tratar erro
  }
};
```

**Fluxo:**
1. Chama `ApiService.register()`
2. Recebe `accessToken` da API
3. Salva token
4. Atualiza `user` state
5. Retorna

#### logout()

Faz logout e limpa tudo.

```tsx
const { logout } = useAuth();

<button onClick={logout}>Sair</button>
```

**Fluxo:**
1. Chama `clearAllCache()` - remove token, cache, etc
2. Seta `user = null`
3. Navega para `/login`

#### checkAuth()

Re-verifica autenticação (útil após erros 401).

```tsx
const { checkAuth } = useAuth();

// Após erro 401 da API
if (error.statusCode === 401) {
  checkAuth(); // Re-valida token
}
```

**Fluxo:**
1. Busca token do localStorage
2. Verifica se expirou
3. Se válido → Extrai dados → Atualiza `user`
4. Se inválido → Limpa cache → Seta `user = null`

### Estado Inicial

Ao carregar a aplicação:

```
1. AuthProvider renderiza
2. useEffect executa
3. checkAuth() é chamado
4. isLoading = true (mostra loading screen)
5. Busca token do localStorage
6. Se tem token válido:
   → Extrai dados do usuário
   → user = { id, email }
   → isAuthenticated = true
7. Se não tem ou inválido:
   → user = null
   → isAuthenticated = false
8. isLoading = false
9. App renderiza normalmente
```

### Benefícios

#### Centralização
✅ Lógica de auth em um só lugar
✅ Evita duplicação de código
✅ Fácil de manter

#### Estado Global
✅ Qualquer componente pode acessar `user`
✅ Não precisa prop drilling
✅ Re-render automático ao mudar estado

#### Segurança
✅ Validação de token centralizada
✅ Limpeza automática de tokens expirados
✅ Navegação automática no logout

#### UX
✅ Loading state global
✅ Transições suaves
✅ Sem flickering

### Exemplo Completo: Login Page

```tsx
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Redirecionar se já está logado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      await login(formData);
      // Sucesso - estado global atualizado automaticamente
      navigate('/profile');
    } catch (err) {
      setError('Email ou senha inválidos');
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Exemplo Completo: Profile Page

```tsx
import { useAuth } from '../contexts/AuthContext';

function Profile() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Bem-vindo, {user?.email}!</h1>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```

### Performance

- ✅ Re-renders otimizados (apenas quando state muda)
- ✅ Validação de token uma vez por sessão
- ✅ Cache em memória para evitar re-parsing

### Melhorias Futuras

- [ ] Token refresh automático
- [ ] Retry em erros de rede
- [ ] Persistência de user data (evitar decode toda hora)
- [ ] Timeout configurável
- [ ] Eventos de auth (onLogin, onLogout)

---

## Estrutura

```
contexts/
├── AuthContext.tsx    # Provider + Hook
└── README.md          # Esta documentação
```

**Próximos contextos:**
- ThemeContext (dark/light mode)
- NotificationContext (toasts)
- ModalContext (modais globais)
