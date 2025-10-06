# Database Schema Documentation

## SQLite Database

Este projeto utiliza **SQLite** como banco de dados, com TypeORM gerenciando as entidades e esquemas.

### Localização
- Arquivo do banco: `database/referral-system.db`
- O arquivo é criado automaticamente na primeira execução

### Schema: Tabela `users`

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | Identificador único do usuário |
| `name` | VARCHAR(255) | NOT NULL | Nome completo do usuário |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Email do usuário (login) |
| `password` | VARCHAR | NOT NULL | Hash bcrypt da senha |
| `score` | INTEGER | DEFAULT 0 | Pontuação de indicações |
| `referralCode` | VARCHAR(10) | UNIQUE, NOT NULL | Código único de indicação |
| `referredById` | VARCHAR | NULLABLE, FK | ID do usuário que indicou |
| `createdAt` | DATETIME | NOT NULL | Data de criação |
| `updatedAt` | DATETIME | NOT NULL | Data de atualização |

### Relacionamentos

- **Self-referential relationship**: Um usuário pode indicar vários outros usuários
  - `referredBy`: ManyToOne - Usuário que fez a indicação
  - `referrals`: OneToMany - Lista de usuários indicados

### Migrations

Como estamos usando `synchronize: true` no TypeORM (apenas para desenvolvimento), as tabelas são criadas/atualizadas automaticamente baseadas nas entidades.

⚠️ **ATENÇÃO**: Em produção, `synchronize` deve ser `false` e migrations manuais devem ser utilizadas.

### Como o banco é criado

1. Na primeira execução do servidor, o TypeORM:
   - Cria o arquivo `database/referral-system.db`
   - Cria a tabela `users` com todas as colunas
   - Cria os índices necessários (UNIQUE constraints)

2. O arquivo `.db` é ignorado pelo Git (ver `.gitignore`)

### Backup

Para fazer backup do banco:
```bash
cp database/referral-system.db database/backup-$(date +%Y%m%d).db
```

### Reset do banco

Para resetar o banco (apagar todos os dados):
```bash
rm database/referral-system.db
npm run start:dev
```
