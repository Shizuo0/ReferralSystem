# API Documentation

## Autenticação

### POST /auth/register

Registra um novo usuário no sistema.

**Request Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "referralCode": "ABC123" // opcional
}
```

**Validações:**
- `name`: obrigatório, string
- `email`: obrigatório, formato de email válido
- `password`: obrigatório, mínimo 8 caracteres, deve conter letras e números
- `referralCode`: opcional, string (código de quem indicou)

**Response (201 Created):**
```json
{
  "message": "Usuário registrado com sucesso",
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "score": 0,
    "referralCode": "JOAO1234",
    "createdAt": "2025-10-05T00:00:00.000Z"
  }
}
```

**Código de Indicação:**
- Gerado automaticamente no registro
- 8 caracteres (4 letras + 4 números)
- Baseado no nome do usuário para ser mais memorável
- Exemplo: "João Silva" → `JOAO1234`
- Garantido ser único no sistema

**Sistema de Pontos:**
- Quando um usuário se registra usando um código de indicação válido:
  - O novo usuário é criado normalmente (score = 0)
  - O usuário que indicou ganha **+1 ponto** automaticamente
  - A pontuação é atualizada imediatamente no banco de dados

**Possíveis Erros:**

- **409 Conflict**: Email já cadastrado
```json
{
  "statusCode": 409,
  "message": "Email já está cadastrado"
}
```

- **400 Bad Request**: Código de indicação inválido
```json
{
  "statusCode": 400,
  "message": "Código de indicação inválido"
}
```

- **400 Bad Request**: Validação de campos
```json
{
  "statusCode": 400,
  "message": [
    "Email deve ser válido",
    "Senha deve ter no mínimo 8 caracteres",
    "Senha deve conter letras e números"
  ]
}
```

**Exemplo de uso com curl:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

---

### POST /auth/login

Realiza login de um usuário existente.

**Request Body:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Validações:**
- `email`: obrigatório, formato de email válido
- `password`: obrigatório, string

**Response (200 OK):**
```json
{
  "message": "Login realizado com sucesso",
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "score": 5,
    "referralCode": "JOAO1234",
    "createdAt": "2025-10-05T00:00:00.000Z"
  },
  "accessToken": "temp-token"
}
```

**Possíveis Erros:**

- **401 Unauthorized**: Email ou senha inválidos
```json
{
  "statusCode": 401,
  "message": "Email ou senha inválidos"
}
```

- **400 Bad Request**: Validação de campos
```json
{
  "statusCode": 400,
  "message": [
    "Email deve ser válido",
    "Senha é obrigatória"
  ]
}
```

**Exemplo de uso com curl:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

---

## Segurança

### Hash de Senhas

As senhas são armazenadas usando **bcrypt** com 10 salt rounds:
- Senhas nunca são armazenadas em texto plano
- Cada senha gera um hash único (mesmo que sejam idênticas)
- Algoritmo bcrypt é resistente a ataques de força bruta

**Exemplo:**
- Senha: `senha123`
- Hash: `$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## Status de Implementação

- ✅ POST /auth/register - Registro completo implementado
- ✅ POST /auth/login - Login básico implementado
- ✅ Hash de senha - Implementado com bcrypt
- ✅ Geração de código único - Implementado (baseado no nome)
- ✅ Sistema de pontos - Implementado (+1 ponto por indicação)
- ⏳ JWT Token - A implementar (commit 2)
- ⏳ Auth Guard - A implementar (commit 3)
