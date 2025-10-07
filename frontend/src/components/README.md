# Componentes Reutilizáveis

Esta pasta contém componentes compartilhados da aplicação.

## PrivateRoute (Otimizado com AuthContext)

Componente para proteger rotas que exigem autenticação. Agora integrado com o AuthContext para melhor performance e sincronização de estado.

### Funcionalidades

1. **Integração com AuthContext**: Usa o estado global de autenticação (não duplica lógica)
2. **Loading State Sincronizado**: Usa `isLoading` do AuthContext
3. **Validação Centralizada**: Token é validado uma vez no AuthContext
4. **Redirect com Estado**: Preserva a localização original para redirect após login
5. **Performance Otimizada**: Não re-valida token se já foi validado

### Uso

```tsx
import { PrivateRoute } from './components/PrivateRoute';
import Profile from './pages/Profile';

// Em App.tsx
<Route 
  path="/profile" 
  element={
    <PrivateRoute>
      <Profile />
    </PrivateRoute>
  } 
/>
```

### Como Funciona (Fluxo Otimizado)

```
1. Componente monta
2. Lê estado do AuthContext:
   - isAuthenticated
   - isLoading
3. Se isLoading = true:
   → Mostra loading spinner
4. Se isLoading = false && !isAuthenticated:
   → Redireciona para /login com location.state
5. Se isLoading = false && isAuthenticated:
   → Renderiza children (página protegida)
```

**Vantagens vs. versão anterior:**
- ✅ Não duplica validação de token
- ✅ Estado sincronizado globalmente
- ✅ Menos re-renders
- ✅ Mais simples e mantível
- ✅ Sincronizado com verificação periódica do AuthContext

### Código Completo

```tsx
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
```

### Estados

| Estado | Tipo | Descrição |
|--------|------|-----------|
| `isLoading` | `boolean` | Vem do AuthContext, indica validação inicial |
| `isAuthenticated` | `boolean` | Vem do AuthContext, indica se usuário está logado |
| `location` | `Location` | Localização atual para preservar no redirect |

### Fluxo de Navegação

#### Cenário 1: Usuário não autenticado tenta acessar /profile

```
1. Acessa /profile
2. PrivateRoute monta
3. isAuthenticated = false
4. Redireciona para /login
5. location.state = { from: { pathname: '/profile' } }
6. Após login bem-sucedido:
   → Login.tsx lê location.state.from
   → Redireciona para /profile (página original)
```

#### Cenário 2: Usuário já autenticado acessa /profile

```
1. Acessa /profile
2. PrivateRoute monta
3. isLoading = true (brevemente)
4. AuthContext valida token
5. isLoading = false, isAuthenticated = true
6. Renderiza <Profile />
```

#### Cenário 3: Token expira durante a sessão

```
1. Usuário está em /profile
2. AuthContext detecta token expirado (verificação periódica)
3. clearAllCache()
4. setUser(null) → isAuthenticated = false
5. navigate('/login', { sessionExpired: true })
6. Login.tsx mostra: "Sua sessão expirou"
```

### Segurança

✅ **Token Validation**
- Validação centralizada no AuthContext
- Verificação periódica a cada 1 minuto
- Validação ao retornar à aba

✅ **Auto-Logout**
- Token expirado → logout automático
- Token inválido → logout automático
- Sincronizado entre abas

✅ **Estado Limpo**
- clearAllCache() remove tudo
- Sem estados inconsistentes
- Re-validação ao reload

### Performance

- ✅ **Validação única**: Token validado uma vez no AuthContext
- ✅ **Menos re-renders**: Usa estado global ao invés de local
- ✅ **Loading otimizado**: Loading state global sincronizado
- ✅ **Cache inteligente**: AuthContext mantém userData em memória

### Melhorias Futuras

- [ ] Suporte a permissões/roles
- [ ] Redirect customizável via props
- [ ] Loading customizável via props
- [x] ~~Cache de validação~~ (agora usa AuthContext)
- [x] ~~Evitar duplicação de lógica~~ (integrado com AuthContext)

---

---

## LoadingSpinner

Componente de spinner de loading reutilizável com suporte a diferentes tamanhos.

### Props

```typescript
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullScreen?: boolean;
}
```

### Uso

```tsx
import { LoadingSpinner } from '../components/LoadingSpinner';

// Spinner pequeno
<LoadingSpinner size="small" />

// Com mensagem
<LoadingSpinner size="medium" message="Carregando dados..." />

// Tela cheia
<LoadingSpinner size="large" message="Carregando..." fullScreen />
```

---

## SkeletonLoader

Componente de skeleton loader para placeholder de conteúdo durante carregamento.

### Props

```typescript
interface SkeletonLoaderProps {
  variant?: 'text' | 'circle' | 'rectangle';
  width?: string | number;
  height?: string | number;
  count?: number;
}
```

### Uso

```tsx
import { SkeletonLoader, ProfileSkeleton, FormSkeleton } from '../components/SkeletonLoader';

// Skeleton de texto
<SkeletonLoader variant="text" width="60%" />

// Skeleton circular (avatar)
<SkeletonLoader variant="circle" width={40} height={40} />

// Skeleton de retângulo
<SkeletonLoader variant="rectangle" width="100%" height={100} />

// Múltiplos skeletons
<SkeletonLoader variant="text" count={3} />

// Skeleton pré-configurado de perfil
<ProfileSkeleton />

// Skeleton pré-configurado de formulário
<FormSkeleton fields={3} />
```

### Skeletons Pré-configurados

#### ProfileSkeleton
Skeleton otimizado para a página de perfil com:
- Header (título + botão)
- Informações do usuário
- Card de pontuação
- Seção de link de indicação

#### FormSkeleton
Skeleton otimizado para formulários com:
- Labels e inputs
- Botão de submit
- Configurável via prop `fields`

---

## Estrutura

```
components/
├── PrivateRoute.tsx      # Rota protegida otimizada
├── LoadingSpinner.tsx    # Spinner reutilizável
├── LoadingSpinner.css    # Estilos do spinner
├── SkeletonLoader.tsx    # Skeleton loaders
├── SkeletonLoader.css    # Estilos dos skeletons
└── README.md             # Esta documentação
```

**Próximos componentes:**
- ErrorBoundary (tratamento de erros)
- Toast/Notification (alertas globais)
- Modal (modais reutilizáveis)
- Form components (inputs, buttons, etc)
