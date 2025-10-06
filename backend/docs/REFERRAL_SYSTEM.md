# Sistema de Indicação - Documentação

## Como funciona

O sistema de indicação permite que usuários ganhem pontos ao indicar novos usuários para a plataforma.

### Fluxo Completo

#### 1. Usuário A se registra

```bash
POST /auth/register
{
  "name": "Maria Santos",
  "email": "maria@example.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "message": "Usuário registrado com sucesso",
  "user": {
    "id": "user-a-id",
    "name": "Maria Santos",
    "email": "maria@example.com",
    "score": 0,
    "referralCode": "MARI5678",
    "createdAt": "2025-10-05T00:00:00.000Z"
  }
}
```

✅ Maria recebe o código de indicação: `MARI5678`

---

#### 2. Maria compartilha seu link/código

Maria pode compartilhar:
- Seu código: `MARI5678`
- Ou um link: `http://seusite.com/register?ref=MARI5678`

---

#### 3. Usuário B se registra usando o código de Maria

```bash
POST /auth/register
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "referralCode": "MARI5678"  ← Código de Maria
}
```

**Resposta:**
```json
{
  "message": "Usuário registrado com sucesso",
  "user": {
    "id": "user-b-id",
    "name": "João Silva",
    "email": "joao@example.com",
    "score": 0,
    "referralCode": "JOAO1234",
    "createdAt": "2025-10-05T00:00:00.000Z"
  }
}
```

✅ João é registrado normalmente  
✅ **Maria ganha +1 ponto automaticamente!**

---

#### 4. Maria consulta seu perfil

Quando Maria consultar seu perfil (será implementado na Issue #4), verá:

```json
{
  "id": "user-a-id",
  "name": "Maria Santos",
  "email": "maria@example.com",
  "score": 1,  ← Pontuação aumentou!
  "referralCode": "MARI5678"
}
```

---

## Regras de Negócio

### Pontuação
- ✅ Cada novo usuário registrado com código válido = **+1 ponto** para quem indicou
- ✅ O novo usuário sempre começa com **0 pontos**
- ✅ Pontuação é incrementada imediatamente após registro
- ✅ Não há limite de indicações

### Código de Indicação
- ✅ Gerado automaticamente no registro
- ✅ Único para cada usuário
- ✅ 8 caracteres (4 letras + 4 números)
- ✅ Baseado no nome do usuário
- ✅ Exemplos:
  - "Maria Santos" → `MARI1234`
  - "João Silva" → `JOAO5678`
  - "Li Wang" → `LIWA9012`

### Validações
- ❌ Código de indicação inexistente → **400 Bad Request**
- ❌ Email já cadastrado → **409 Conflict**
- ❌ Senha inválida (< 8 chars ou sem letras/números) → **400 Bad Request**
- ❌ Email inválido → **400 Bad Request**

---

## Estrutura no Banco de Dados

### Tabela: users

```sql
CREATE TABLE users (
  id VARCHAR PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  score INTEGER DEFAULT 0,
  referralCode VARCHAR(10) UNIQUE NOT NULL,
  referredById VARCHAR NULL,  -- ID de quem indicou
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (referredById) REFERENCES users(id)
);
```

### Relacionamentos

- **referredBy** (ManyToOne): Usuário que fez a indicação
- **referrals** (OneToMany): Lista de usuários indicados

**Exemplo:**

```
Maria (id: 1, score: 2)
  └── indicou → João (id: 2, referredById: 1)
  └── indicou → Ana (id: 3, referredById: 1)
```

---

## Exemplos de Teste

### Cenário 1: Registro sem indicação
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Santos",
    "email": "maria@example.com",
    "password": "senha123"
  }'
```
✅ Maria registrada com score = 0

---

### Cenário 2: Registro com indicação válida
```bash
# Primeiro, Maria se registra e obtém código MARI5678

# Depois, João se registra usando código de Maria
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123",
    "referralCode": "MARI5678"
  }'
```
✅ João registrado com score = 0  
✅ Maria agora tem score = 1

---

### Cenário 3: Registro com código inválido
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123",
    "referralCode": "INVALID"
  }'
```
❌ Erro 400: "Código de indicação inválido"

---

## Implementação Técnica

### AuthService.register()

1. **Validação de email duplicado**
   ```typescript
   const existingUser = await this.userRepository.findOne({ where: { email } });
   if (existingUser) throw new ConflictException('Email já está cadastrado');
   ```

2. **Validação de código de indicação**
   ```typescript
   if (referralCode) {
     referrer = await this.userRepository.findOne({ where: { referralCode } });
     if (!referrer) throw new BadRequestException('Código de indicação inválido');
   }
   ```

3. **Hash da senha**
   ```typescript
   const hashedPassword = await HashUtil.hashPassword(password);
   ```

4. **Geração de código único**
   ```typescript
   const uniqueReferralCode = await this.generateUniqueReferralCode(name);
   ```

5. **Salvamento do usuário**
   ```typescript
   const newUser = this.userRepository.create({
     name,
     email,
     password: hashedPassword,
     referralCode: uniqueReferralCode,
     referredById: referrer?.id || null,
     score: 0,
   });
   await this.userRepository.save(newUser);
   ```

6. **Incremento de pontuação**
   ```typescript
   if (referrer) {
     await this.userRepository.increment({ id: referrer.id }, 'score', 1);
   }
   ```

---

## Próximos Passos

- [ ] **Issue #3**: Implementar login
- [ ] **Issue #4**: Endpoint de perfil para consultar pontuação
- [ ] **Frontend**: Página de cadastro com suporte a código de indicação via URL
- [ ] **Frontend**: Página de perfil mostrando pontuação e link de indicação
- [ ] **Frontend**: Botão "Copiar Link" para compartilhar

---

## Métricas e Analytics (Futuro)

Possíveis melhorias:
- Dashboard mostrando ranking de usuários por pontuação
- Histórico de indicações (quem indicou quem)
- Recompensas por marcos (10 indicações, 50 indicações, etc.)
- Sistema de níveis/badges
