# JWT (JSON Web Token) - Documentação

## Configuração

### Variáveis de Ambiente

Configure no arquivo `.env`:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

**⚠️ IMPORTANTE:**
- Em **produção**, use um secret forte e único
- Nunca commite o arquivo `.env` no git
- Recomendado: secret com pelo menos 32 caracteres aleatórios

### Gerando um JWT_SECRET seguro

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# OpenSSL
openssl rand -hex 32
```

---

## Como funciona

### 1. Login retorna um JWT

```bash
POST /auth/login
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "message": "Login realizado com sucesso",
  "user": { ... },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLWlkIiwiZW1haWwiOiJqb2FvQGV4YW1wbGUuY29tIiwiaWF0IjoxNjk2NTAwMDAwLCJleHAiOjE2OTcxMDQ4MDB9.signature"
}
```

---

### 2. Estrutura do Token

O JWT é dividido em 3 partes separadas por `.`:

```
[Header].[Payload].[Signature]
```

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "sub": "user-id-uuid",
  "email": "joao@example.com",
  "iat": 1696500000,
  "exp": 1697104800
}
```

- `sub` (subject): ID do usuário
- `email`: Email do usuário
- `iat` (issued at): Timestamp de quando foi gerado
- `exp` (expires): Timestamp de expiração (7 dias por padrão)

**Signature:**
- Hash gerado usando `JWT_SECRET`
- Garante que o token não foi alterado

---

### 3. Usando o Token em Requisições

Todas as rotas protegidas requerem o token no header:

```bash
curl -X GET http://localhost:3000/user/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**No Frontend (JavaScript):**

```javascript
// Após login, salvar token
const { accessToken } = response.data;
localStorage.setItem('token', accessToken);

// Usar token em requisições
const token = localStorage.getItem('token');
fetch('http://localhost:3000/user/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## Decodificando o Token

### No Backend (NestJS)

O token é automaticamente decodificado pelo Guard:

```typescript
@Get('profile')
@UseGuards(JwtAuthGuard)
async getProfile(@Request() req) {
  // req.user contém o payload decodificado
  console.log(req.user); // { sub: 'user-id', email: 'user@example.com' }
}
```

### No Frontend (JavaScript)

```javascript
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

const payload = parseJwt(token);
console.log(payload);
// { sub: 'user-id', email: 'user@example.com', iat: ..., exp: ... }
```

---

## Segurança

### ✅ Boas Práticas

1. **Armazenamento no Frontend:**
   - ✅ localStorage ou sessionStorage (para SPAs)
   - ✅ httpOnly cookies (mais seguro contra XSS)
   - ❌ Nunca em URLs ou query parameters

2. **Expiração:**
   - Token expira em 7 dias (configurável)
   - Usuário precisa fazer login novamente após expiração
   - Considere implementar refresh tokens para melhor UX

3. **Secret:**
   - Use um secret forte e único em produção
   - Mantenha o secret em variável de ambiente
   - Nunca exponha o secret no código

4. **HTTPS:**
   - Sempre use HTTPS em produção
   - Evita que o token seja interceptado

### ⚠️ Cuidados

- **Token não pode ser revogado**: Uma vez emitido, é válido até expirar
- **Token contém dados sensíveis**: Não coloque senhas ou dados confidenciais no payload
- **Token pode ser decodificado**: Qualquer um pode ler o payload (mas não alterar sem invalidar a assinatura)

---

## Tratamento de Erros

### Token Expirado

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**Solução:** Usuário deve fazer login novamente

### Token Inválido

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**Causas:**
- Token adulterado
- Assinatura inválida
- Formato incorreto

### Token Ausente

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**Solução:** Incluir header `Authorization: Bearer <token>`

---

## Exemplo Completo de Fluxo

```javascript
// 1. Login
const loginResponse = await fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'joao@example.com',
    password: 'senha123'
  })
});

const { accessToken, user } = await loginResponse.json();

// 2. Salvar token
localStorage.setItem('token', accessToken);
console.log('Usuário logado:', user.name);

// 3. Usar token em requisições
const profileResponse = await fetch('http://localhost:3000/user/profile', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

const profile = await profileResponse.json();
console.log('Pontuação:', profile.score);

// 4. Logout (limpar token)
localStorage.removeItem('token');
```

---

## Próximos Passos

- [ ] Implementar refresh tokens
- [ ] Blacklist de tokens (logout)
- [ ] Rate limiting
- [ ] 2FA (Two-Factor Authentication)
