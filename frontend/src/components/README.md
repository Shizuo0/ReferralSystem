# Componentes Reutilizáveis

Esta pasta contém componentes compartilhados da aplicação.

## PrivateRoute

Componente de rota protegida que garante que apenas usuários autenticados possam acessar determinadas páginas.

### Funcionalidades

✅ **Validação de Token**
- Verifica presença do token no localStorage
- Decodifica JWT para validar estrutura
- Verifica expiração do token
- Remove token automaticamente se inválido/expirado

✅ **Loading State**
- Mostra spinner enquanto valida token
- Mensagem "Verificando autenticação..."
- Evita flicker de redirecionamento

✅ **Redirecionamento Inteligente**
- Salva localização original em `state`
- Permite voltar após login
- Usa `replace` para não poluir histórico

✅ **Limpeza Automática**
- Remove token expirado
- Limpa cache completo ao detectar problemas
- Evita estados inconsistentes

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

### Fluxo de Validação

```
1. Usuário acessa rota protegida
2. PrivateRoute é renderizado
3. Estado: isValidating = true
   → Mostra loading spinner
4. Busca token do localStorage
5. Se não tem token:
   → Redireciona para /login
6. Se tem token:
   → Decodifica JWT
   → Verifica estrutura
   → Verifica expiração (exp < now)
7. Token válido:
   → isAuthenticated = true
   → Renderiza children (página protegida)
8. Token inválido/expirado:
   → clearAllCache()
   → Redireciona para /login
```

### Estados

| Estado | Tipo | Descrição |
|--------|------|-----------|
| `isValidating` | boolean | Validando token |
| `isAuthenticated` | boolean | Token válido |

### Validações de Token

#### 1. Presença
```typescript
const token = getAuthToken();
if (!token) {
  // Redirecionar para login
}
```

#### 2. Estrutura JWT
```typescript
const payload = parseJWT(token);
if (!payload) {
  // Token malformado
  clearAllCache();
}
```

#### 3. Expiração
```typescript
const currentTime = Math.floor(Date.now() / 1000);
if (payload.exp < currentTime) {
  // Token expirado
  clearAllCache();
}
```

### Benefícios vs Versão Simples

#### Antes (Versão Simples)
```tsx
export const PrivateRoute = ({ children }) => {
  const token = getAuthToken();
  return token ? <>{children}</> : <Navigate to="/login" />;
};
```

**Problemas:**
- ❌ Não valida expiração
- ❌ Não mostra loading
- ❌ Flicker ao redirecionar
- ❌ Token inválido não é removido

#### Depois (Versão Aprimorada)
```tsx
export const PrivateRoute = ({ children }) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Validação assíncrona completa
  }, []);
  
  if (isValidating) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <>{children}</>;
};
```

**Benefícios:**
- ✅ Valida expiração
- ✅ Loading state suave
- ✅ Sem flicker
- ✅ Limpeza automática

### Segurança

#### O que protege
✅ Acesso não autorizado a rotas
✅ Tokens expirados
✅ Tokens malformados
✅ localStorage vazio

#### O que NÃO protege
⚠️ Token roubado (XSS)
⚠️ Man-in-the-middle (MITM)
⚠️ CSRF (use cookies httpOnly para proteção completa)

**Nota:** Para produção, considere:
- Cookies httpOnly + SameSite
- Token refresh automático
- Revogação de tokens (blacklist)

### Performance

- Validação rápida (< 50ms)
- Sem requisições HTTP desnecessárias
- Cache de validação em memória (futuro)

### Melhorias Futuras

- [ ] Token refresh automático
- [ ] Validação com backend (optional)
- [ ] Cache de validação
- [ ] Retry em caso de erro de rede
- [ ] Timeout configurável

---

## Outros Componentes (Futuro)

### LoadingSpinner
Spinner reutilizável para loading states.

### ErrorBoundary
Captura erros de React e mostra fallback.

### Toast
Notificações temporárias.

### Modal
Diálogos modais reutilizáveis.
