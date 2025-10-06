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
    "referralCode": "TEMP",
    "createdAt": "2025-10-05T00:00:00.000Z"
  }
}
```

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

- ✅ POST /auth/register - Registro básico implementado
- ✅ Hash de senha - Implementado com bcrypt
- ⏳ Geração de código único - A implementar (commit 4)
- ⏳ Sistema de pontos - A implementar (commit 5)
