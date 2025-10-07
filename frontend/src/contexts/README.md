# Contextos da Aplicação

Esta pasta contém os contextos React para gerenciamento de estado global.

---

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

**Ver documentação completa no arquivo original.**

---

## LoadingContext

Gerencia o estado global de loading da aplicação.

### Funcionalidades

✅ **Estado Global de Loading**
- `isLoading`: Boolean indicando se está carregando
- `loadingMessage`: Mensagem personalizada do loading

✅ **Métodos**
- `startLoading(message?)`: Inicia loading com mensagem opcional
- `stopLoading()`: Para loading e reseta mensagem
- `setLoadingMessage(message)`: Atualiza mensagem durante loading

✅ **Global Loading Overlay**
- Overlay fullscreen com blur
- Spinner animado
- Mensagem personalizável
- z-index elevado (acima de tudo)

### Uso Básico

```tsx
import { useLoading } from '../contexts/LoadingContext';

function MyComponent() {
  const { isLoading, startLoading, stopLoading } = useLoading();

  const handleAction = async () => {
    startLoading('Processando...');
    
    try {
      await someAsyncOperation();
    } finally {
      stopLoading();
    }
  };

  return <button onClick={handleAction}>Executar</button>;
}
```

### Uso Avançado

```tsx
const { startLoading, stopLoading, setLoadingMessage } = useLoading();

const handleMultiStepAction = async () => {
  startLoading('Passo 1: Validando dados...');
  
  await step1();
  setLoadingMessage('Passo 2: Enviando para servidor...');
  
  await step2();
  setLoadingMessage('Passo 3: Finalizando...');
  
  await step3();
  stopLoading();
};
```

### Configuração

O `LoadingProvider` deve envolver toda a aplicação:

```tsx
import { LoadingProvider } from './contexts/LoadingContext';

function App() {
  return (
    <BrowserRouter>
      <LoadingProvider>
        <AuthProvider>
          {/* Resto da aplicação */}
        </AuthProvider>
      </LoadingProvider>
    </BrowserRouter>
  );
}
```

### Overlay Global

Quando `isLoading` é `true`, o overlay aparece automaticamente:

```
┌─────────────────────────────────┐
│     [Background com blur]       │
│                                 │
│     ┌─────────────────┐         │
│     │   [Spinner]     │         │
│     │  "Mensagem..."  │         │
│     └─────────────────┘         │
│                                 │
└─────────────────────────────────┘
```

**Características:**
- Bloqueia interação com a página
- Backdrop blur de 4px
- Animação de fade-in
- Spinner animado
- Mensagem centralizada

### Benefícios

✅ **Centralização**
- Loading global em um só lugar
- Evita spinners duplicados
- Consistência visual

✅ **Flexibilidade**
- Mensagens personalizáveis
- Controle fino (start/stop)
- Múltiplos passos

✅ **UX**
- Feedback visual claro
- Previne clicks duplos
- Indicação de progresso

### Exemplo Completo

```tsx
import { useLoading } from '../contexts/LoadingContext';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const { login } = useAuth();
  const { startLoading, stopLoading } = useLoading();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    startLoading('Fazendo login...');
    
    try {
      await login(formData);
      // Sucesso - usuário será redirecionado
    } catch (error) {
      console.error(error);
      stopLoading(); // Parar loading em caso de erro
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

## Estrutura

```
contexts/
├── AuthContext.tsx       # Provider + Hook de autenticação
├── LoadingContext.tsx    # Provider + Hook de loading global
└── README.md             # Esta documentação
```

**Próximos contextos:**
- ThemeContext (dark/light mode)
- NotificationContext (toasts)
- ModalContext (modais globais)
