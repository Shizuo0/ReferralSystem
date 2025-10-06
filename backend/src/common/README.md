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
