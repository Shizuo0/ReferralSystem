# Users Module - Gerenciamento de Usuários

Este módulo gerencia os dados e perfis dos usuários.

## Estrutura

```
users/
├── users.controller.ts    # Endpoints de usuário
├── users.service.ts       # Lógica de negócio
├── users.module.ts        # Configuração do módulo
├── user.entity.ts         # Entidade TypeORM
└── README.md              # Este arquivo
```

---

## Endpoints

### GET /user/profile

Retorna o perfil completo do usuário autenticado.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Maria Santos",
  "email": "maria@example.com",
  "score": 5,
  "referralCode": "MARI1234",
  "referralLink": "http://localhost:5173/register?ref=MARI1234",
  "createdAt": "2025-10-06T00:00:00.000Z"
}
```

**Campos:**
- `id`: ID único do usuário
- `name`: Nome completo
- `email`: Email de login
- `score`: Pontuação de indicações
- `referralCode`: Código único de indicação (8 caracteres)
- `referralLink`: Link completo para compartilhar
- `createdAt`: Data de cadastro

**Segurança:**
- ✅ Rota protegida (requer autenticação)
- ✅ Senha nunca é retornada
- ✅ Usuário só pode ver o próprio perfil

---

## UsersService

### Métodos Públicos

#### `getProfile(userId: string)`

Busca e retorna o perfil do usuário.

**Parâmetros:**
- `userId`: ID do usuário (extraído do JWT)

**Retorna:**
- Objeto com dados do perfil (sem senha)
- Inclui link de indicação gerado

**Lança:**
- `NotFoundException`: Se usuário não existir

**Exemplo:**
```typescript
const profile = await usersService.getProfile('user-uuid');
console.log(profile.referralLink);
// "http://localhost:5173/register?ref=MARI1234"
```

---

#### `findById(userId: string): Promise<User | null>`

Busca usuário por ID (para uso interno em outros módulos).

**Parâmetros:**
- `userId`: ID do usuário

**Retorna:**
- Entidade User completa (com senha hash)
- `null` se não encontrado

**Uso:**
```typescript
const user = await usersService.findById('user-uuid');
if (user) {
  // Usar dados do usuário
}
```

---

### Métodos Privados

#### `generateReferralLink(referralCode: string): string`

Gera link completo de indicação.

**Parâmetros:**
- `referralCode`: Código de indicação do usuário

**Retorna:**
- URL completa: `${FRONTEND_URL}/register?ref=${referralCode}`

**Configuração:**
- Usa variável de ambiente `FRONTEND_URL`
- Default: `http://localhost:5173`

**Exemplos:**
```typescript
// Desenvolvimento
generateReferralLink('MARI1234')
// → "http://localhost:5173/register?ref=MARI1234"

// Produção (com FRONTEND_URL=https://myapp.com)
generateReferralLink('MARI1234')
// → "https://myapp.com/register?ref=MARI1234"
```

---

## User Entity

### Campos

```typescript
{
  id: string;                    // UUID primary key
  name: string;                  // Nome do usuário
  email: string;                 // Email único
  password: string;              // Hash bcrypt
  score: number;                 // Pontuação (default: 0)
  referralCode: string;          // Código único (8 chars)
  referredById: string | null;   // ID de quem indicou
  createdAt: Date;               // Timestamp de criação
  updatedAt: Date;               // Timestamp de atualização
}
```

### Relacionamentos

```typescript
// Quem me indicou
@ManyToOne(() => User)
referredBy: User | null;

// Quem eu indiquei
@OneToMany(() => User)
referrals: User[];
```

**Exemplo de uso:**
```typescript
const user = await userRepository.findOne({
  where: { id: userId },
  relations: ['referredBy', 'referrals']
});

console.log(user.referredBy?.name); // "Maria Santos"
console.log(user.referrals.length); // 3
```

---

## Fluxo de Uso

### 1. Usuário faz login

```
POST /auth/login
→ Recebe JWT token
```

### 2. Frontend busca perfil

```
GET /user/profile + Authorization header
→ Recebe dados do perfil
```

### 3. Frontend exibe dados

```javascript
const response = await fetch('/user/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const profile = await response.json();

// Exibir nome
document.getElementById('username').textContent = profile.name;

// Exibir pontuação
document.getElementById('score').textContent = profile.score;

// Copiar link
navigator.clipboard.writeText(profile.referralLink);
```

---

## Variáveis de Ambiente

```env
# URL do frontend (para gerar link de indicação)
FRONTEND_URL=http://localhost:5173

# Em produção
FRONTEND_URL=https://myapp.com
```

---

## Exemplo Completo

### Backend (Controller)

```typescript
@Controller('user')
export class UsersController {
  @Get('profile')
  async getProfile(@CurrentUser() user: JwtPayload) {
    return this.usersService.getProfile(user.sub);
  }
}
```

### Frontend (React/TypeScript)

```typescript
async function fetchProfile(token: string) {
  const response = await fetch('http://localhost:3000/user/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (response.ok) {
    const profile = await response.json();
    return profile;
  }
  
  throw new Error('Failed to fetch profile');
}

// Usar
const profile = await fetchProfile(token);
console.log(`Olá, ${profile.name}!`);
console.log(`Você tem ${profile.score} pontos`);
console.log(`Seu link: ${profile.referralLink}`);
```

---

## Testes

```bash
# Login
TOKEN=$(curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@example.com","password":"senha123"}' \
  | jq -r '.accessToken')

# Buscar perfil
curl -X GET http://localhost:3000/user/profile \
  -H "Authorization: Bearer $TOKEN" \
  | jq

# Resultado:
# {
#   "id": "uuid",
#   "name": "Maria Santos",
#   "email": "maria@example.com",
#   "score": 5,
#   "referralCode": "MARI1234",
#   "referralLink": "http://localhost:5173/register?ref=MARI1234",
#   "createdAt": "2025-10-06T00:00:00.000Z"
# }
```

---

## Próximos Passos

- [ ] Endpoint para atualizar nome
- [ ] Endpoint para listar indicações (quem eu indiquei)
- [ ] Endpoint para ver ranking de pontuação
- [ ] Avatar/foto de perfil
- [ ] Histórico de pontos ganhos
- [ ] Estatísticas detalhadas
