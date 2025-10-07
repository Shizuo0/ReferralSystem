# Services - Serviços de API

Esta pasta contém serviços para comunicação com o backend.

## ApiService

Serviço centralizado para todas as chamadas à API.

### Configuração

A URL base da API é configurada via variável de ambiente:

```env
VITE_API_URL=http://localhost:3000
```

Se não configurada, usa `http://localhost:3000` como padrão.

### Métodos

#### `register(data: RegisterData): Promise<AuthResponse>`

Registra um novo usuário.

**Parâmetros:**
```typescript
{
  name: string;
  email: string;
  password: string;
  referralCode?: string;  // opcional
}
```

**Retorna:**
```typescript
{
  message: string;
  user: User;
  accessToken?: string;
}
```

**Lança:**
- `ApiError` se o registro falhar

**Exemplo:**
```typescript
try {
  const response = await ApiService.register({
    name: 'João Silva',
    email: 'joao@example.com',
    password: 'senha123'
  });
  
  console.log('Usuário criado:', response.user);
  localStorage.setItem('token', response.accessToken);
} catch (error) {
  const apiError = error as ApiError;
  console.error(apiError.message);
}
```

---

#### `login(email: string, password: string): Promise<AuthResponse>`

Faz login de um usuário.

**Retorna:**
```typescript
{
  message: string;
  user: User;
  accessToken: string;
}
```

---

#### `getProfile(token: string): Promise<User>`

Busca perfil do usuário autenticado.

**Parâmetros:**
- `token`: JWT token de autenticação

**Retorna:** Dados do usuário incluindo `referralLink`

---

## Tratamento de Erros

### Erros da API

A API retorna erros no formato:

```typescript
{
  statusCode: number;
  message: string | string[];
  error?: string;
}
```

**Exemplos:**

**Email duplicado (409):**
```json
{
  "statusCode": 409,
  "message": "Email já está cadastrado"
}
```

**Validação falhou (400):**
```json
{
  "statusCode": 400,
  "message": [
    "Senha deve ter no mínimo 8 caracteres",
    "Senha deve conter letras e números"
  ]
}
```

### Como tratar

```typescript
try {
  await ApiService.register(data);
} catch (error) {
  const apiError = error as ApiError;
  
  let errorMessage = 'Erro desconhecido';
  
  if (Array.isArray(apiError.message)) {
    errorMessage = apiError.message.join(', ');
  } else if (apiError.message) {
    errorMessage = apiError.message;
  }
  
  setError(errorMessage);
}
```

---

## Próximos Passos

- [ ] Adicionar interceptors para logging
- [ ] Implementar retry logic
- [ ] Cache de requisições
- [ ] Refresh token automático
