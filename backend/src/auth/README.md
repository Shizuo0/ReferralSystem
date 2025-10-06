# Auth Module - Sistema de Autenticação

Este módulo gerencia toda a autenticação da aplicação, incluindo registro, login e geração de tokens JWT.

## Estrutura

```
auth/
├── auth.controller.ts         # Endpoints de autenticação
├── auth.service.ts            # Lógica de negócio
├── auth.module.ts             # Configuração do módulo (com JWT)
├── dto/                       # Data Transfer Objects
│   ├── register.dto.ts        # Validação de registro
│   ├── login.dto.ts           # Validação de login
│   ├── auth-response.dto.ts   # Resposta com dados do usuário
│   └── login-response.dto.ts  # Resposta de login (user + token)
└── interfaces/
    └── jwt-payload.interface.ts  # Estrutura do payload JWT
```

## Endpoints

### POST /auth/register

Registra um novo usuário com:
- Hash de senha (bcrypt)
- Código de indicação único
- Sistema de pontos (incrementa quem indicou)

**Request:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "referralCode": "MARI5678"  // opcional
}
```

**Response:**
```json
{
  "message": "Usuário registrado com sucesso",
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "score": 0,
    "referralCode": "JOAO1234",
    "createdAt": "2025-10-05T..."
  }
}
```

---

### POST /auth/login

Autentica usuário e retorna JWT token.

**Request:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "message": "Login realizado com sucesso",
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "score": 5,
    "referralCode": "JOAO1234",
    "createdAt": "2025-10-05T..."
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## JWT Configuration

### Configuração (auth.module.ts)

```typescript
JwtModule.register({
  global: true,  // JWT disponível em toda aplicação
  secret: process.env.JWT_SECRET || 'default-secret',
  signOptions: {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  }
})
```

### Payload do Token

```typescript
interface JwtPayload {
  sub: string;      // User ID
  email: string;    // User email
  iat?: number;     // Issued at
  exp?: number;     // Expiration
}
```

### Usando o Token

```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/user/profile
```

---

## Segurança

### Hash de Senhas

- **Algoritmo**: bcrypt com 10 salt rounds
- **Implementação**: `HashUtil.hashPassword()` e `HashUtil.comparePassword()`
- Senhas nunca são armazenadas em texto plano
- Cada hash é único, mesmo para senhas idênticas

### Validações

**Registro:**
- Email: formato válido, único no sistema
- Senha: mínimo 8 caracteres, letras + números
- Nome: obrigatório
- Código de indicação: validado se fornecido

**Login:**
- Email: formato válido
- Senha: obrigatória
- Mensagem genérica de erro (evita enumeration attack)

### JWT

- Token assinado com `JWT_SECRET`
- Válido por 7 dias (configurável)
- Não pode ser adulterado sem invalidar assinatura
- Contém apenas dados não-sensíveis (ID e email)

---

## Fluxo de Autenticação

### 1. Registro

```
Cliente → POST /auth/register
  ↓
Validar dados (DTO)
  ↓
Verificar email único
  ↓
Validar código de indicação (se fornecido)
  ↓
Hash da senha
  ↓
Gerar código único
  ↓
Salvar usuário
  ↓
Incrementar pontos do referrer
  ↓
Retornar dados (sem senha)
```

### 2. Login

```
Cliente → POST /auth/login
  ↓
Validar dados (DTO)
  ↓
Buscar usuário por email
  ↓
Comparar senha (bcrypt)
  ↓
Gerar JWT token
  ↓
Retornar user + token
```

### 3. Requisições Autenticadas (próximo commit)

```
Cliente → GET /user/profile + Authorization header
  ↓
JwtAuthGuard valida token
  ↓
Decodifica payload
  ↓
Injeta user no request
  ↓
Controller acessa req.user
```

---

## Métodos do AuthService

### `register(registerDto: RegisterDto): Promise<RegisterResponseDto>`

Registra novo usuário com todas as validações e lógica de indicação.

**Lança:**
- `ConflictException`: Email já cadastrado
- `BadRequestException`: Código de indicação inválido
- `InternalServerErrorException`: Falha ao gerar código único

---

### `login(loginDto: LoginDto): Promise<LoginResponseDto>`

Autentica usuário e gera JWT token.

**Lança:**
- `UnauthorizedException`: Email ou senha inválidos

---

### `generateToken(user: User): Promise<string>` (private)

Gera JWT token com payload contendo ID e email do usuário.

---

### `generateUniqueReferralCode(name: string): Promise<string>` (private)

Gera código de indicação único baseado no nome.

**Estratégia:**
1. Tenta 10x com código baseado no nome
2. Se falhar, tenta 10x com código aleatório
3. Se ainda falhar, lança erro

---

### `incrementReferrerScore(referrerId: string): Promise<void>` (private)

Incrementa +1 ponto para o usuário que fez a indicação.

---

## Testes

```bash
# Rodar testes do AuthService
npm test -- auth.service.spec.ts

# Testes implementados:
# ✓ Registrar novo usuário
# ✓ Rejeitar email duplicado
# ✓ Rejeitar código de indicação inválido
# ✓ Incrementar pontos do referrer
# ✓ Não incrementar sem código
```

---

## Variáveis de Ambiente

```env
# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d

# Server
PORT=3000
FRONTEND_URL=http://localhost:5173
```

---

## Próximos Passos

- [ ] Implementar JwtAuthGuard (commit 3)
- [ ] Proteger rotas com @UseGuards(JwtAuthGuard)
- [ ] Implementar refresh tokens
- [ ] Adicionar logout (blacklist de tokens)
- [ ] Rate limiting para login
- [ ] 2FA (Two-Factor Authentication)
