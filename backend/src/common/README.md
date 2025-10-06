# Common Utilities

Esta pasta contém utilitários compartilhados em todo o projeto.

## Utils

### HashUtil

Utilitário para hash e comparação de senhas usando bcrypt.

**Métodos:**

- `hashPassword(password: string): Promise<string>`
  - Gera hash bcrypt da senha com 10 salt rounds
  - Retorna hash para armazenar no banco de dados
  
- `comparePassword(password: string, hash: string): Promise<boolean>`
  - Compara senha em texto plano com hash armazenado
  - Retorna true se a senha corresponde ao hash

**Exemplo de uso:**

```typescript
import { HashUtil } from './common/utils/hash.util';

// Ao registrar usuário
const hashedPassword = await HashUtil.hashPassword('senha123');
// Salvar hashedPassword no banco

// Ao fazer login
const isValid = await HashUtil.comparePassword('senha123', hashedPassword);
if (isValid) {
  // Login bem-sucedido
}
```

**Segurança:**
- Usa bcrypt com 10 salt rounds (equilíbrio entre segurança e performance)
- Cada hash é único, mesmo para senhas idênticas
- Resistente a ataques de força bruta
- Senhas nunca são armazenadas em texto plano

---

### ReferralCodeUtil

Utilitário para geração de códigos de indicação únicos.

**Métodos:**

- `generateCode(): string`
  - Gera código totalmente aleatório de 8 caracteres
  - Usa apenas letras maiúsculas (A-Z) e números (0-9)
  - Exemplo: `"K2X9M4L7"`

- `generateFromName(name: string): string`
  - Gera código baseado no nome do usuário + números aleatórios
  - Mais amigável e fácil de lembrar
  - Formato: 4 letras do nome + 4 números
  - Exemplo: `"JOAO1234"` (para "João Silva")

**Exemplo de uso:**

```typescript
import { ReferralCodeUtil } from './common/utils/referral-code.util';

// Código aleatório
const randomCode = ReferralCodeUtil.generateCode();
// "K2X9M4L7"

// Código baseado no nome
const nameCode = ReferralCodeUtil.generateFromName('João Silva');
// "JOAO1234"
```

**Características:**
- Códigos de 8 caracteres (fáceis de compartilhar)
- Apenas letras maiúsculas e números (evita confusão)
- Geração baseada no nome torna códigos mais memoráveis
- Remove caracteres especiais e acentos automaticamente
