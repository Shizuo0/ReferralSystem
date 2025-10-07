# 🎯 Sistema de Indicação (Referral System)

Uma aplicação web que implementa um sistema de pontos por indicação, permitindo que usuários se cadastrem, façam login e ganhem pontos ao indicar amigos.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)

---

## 📋 Funcionalidades

### Autenticação e Cadastro
- ✅ **Registro de Usuários**: Formulário completo com validação client-side
  - Nome (mínimo 3 caracteres)
  - Email (formato válido)
  - Senha (mínimo 8 caracteres com letras e números)
- ✅ **Login Seguro**: Autenticação com JWT (JSON Web Tokens)
- ✅ **Proteção de Rotas**: Apenas usuários autenticados acessam páginas protegidas
- ✅ **Persistência de Sessão**: Login mantido após recarregar a página
- ✅ **Logout com Confirmação**: Modal de confirmação antes de sair

### Sistema de Indicação
- ✅ **Código Único de Indicação**: Cada usuário recebe um código exclusivo
- ✅ **Link Personalizado**: URL com código de indicação pré-preenchido
- ✅ **Botão "Copiar Link"**: Copia link para área de transferência com feedback visual
- ✅ **Pontuação Automática**: +1 ponto para quem indicou quando alguém se cadastra
- ✅ **Rastreamento de Indicações**: Sistema registra quem indicou quem

### Página de Perfil
- ✅ **Visualização de Dados**: Nome, email e pontuação atual
- ✅ **Pontuação em Destaque**: Card visual com total de indicações
- ✅ **Link de Indicação**: Exibido com botão de copiar
- ✅ **Feedback em Tempo Real**: Atualizações ao recarregar

### Experiência do Usuário (UX)
- ✅ **Design Responsivo**: Funciona perfeitamente em desktop e mobile
- ✅ **Tema Dark**: Interface moderna com cores escuras e gradientes
- ✅ **Animações Suaves**: Transições e efeitos visuais polidos
- ✅ **Loading States**: Spinners e skeleton loaders durante carregamento
- ✅ **Notificações Toast**: Feedback visual de sucesso/erro
- ✅ **Validação em Tempo Real**: Erros mostrados conforme usuário digita
- ✅ **Acessibilidade**: Suporte a leitores de tela e navegação por teclado

---

## 🛠️ Tecnologias Utilizadas

### Frontend

#### **React 18 + TypeScript + Vite**
**Por que escolhi:**
- **React**: Biblioteca mais popular para SPAs, com ecossistema maduro e grande comunidade
- **TypeScript**: Tipagem estática previne bugs, melhora IDE support e facilita refatoração
- **Vite**: Build tool extremamente rápido, HMR instantâneo, melhor DX que Create React App

**Benefícios:**
- Componentes reutilizáveis e manuteníveis
- Type safety em todo o código
- Desenvolvimento ágil com hot reload
- Bundle otimizado para produção

#### **React Router DOM v6**
**Por que escolhi:**
- Padrão de facto para roteamento em React
- Suporte nativo a lazy loading de componentes
- API declarativa e intuitiva

**Implementação:**
- Lazy loading de páginas (code splitting)
- Rotas protegidas com `PrivateRoute`
- Navegação programática

#### **CSS Puro com Design System**
**Por que NÃO usei frameworks (Tailwind, Bootstrap, etc):**
- Requisito do desafio: demonstrar habilidades com CSS puro
- Controle total sobre estilos
- Sem overhead de bibliotecas não utilizadas
- Oportunidade de criar design system próprio

**Implementação:**
- CSS Variables para tema consistente
- Animações com `@keyframes`
- Glassmorphism e gradientes
- Media queries para responsividade
- `prefers-reduced-motion` para acessibilidade

### Backend

#### **NestJS + TypeScript**
**Por que escolhi:**
- Framework enterprise-ready inspirado em Angular
- Arquitetura modular e escalável (modules, controllers, services)
- Decorators e dependency injection out-of-the-box
- Excelente integração com TypeORM e JWT

**Benefícios:**
- Código organizado e testável
- Padrões de projeto incorporados
- Fácil manutenção e expansão
- Type safety no backend

#### **SQLite + TypeORM**
**Por que escolhi SQLite:**
- Zero configuração (arquivo local)
- Perfeito para desenvolvimento e demos
- Sem necessidade de servidor de banco separado
- Fácil de versionar e fazer backup

**Por que TypeORM:**
- ORM mais popular no ecossistema NestJS
- Suporte a TypeScript de primeira classe
- Migrations automáticas
- Relações e queries type-safe

**Schema:**
```typescript
User {
  id: string (UUID)
  name: string
  email: string (unique)
  password: string (hashed com bcrypt)
  score: number (pontuação)
  referralCode: string (código único)
  referredById: string | null (quem indicou)
  createdAt: Date
}
```

#### **JWT (JSON Web Tokens)**
**Por que escolhi:**
- Stateless authentication (sem sessões no servidor)
- Payload contém dados do usuário (reduz queries)
- Fácil de validar e seguro
- Padrão da indústria

**Implementação:**
- Token expira em 24h
- Verificação periódica no frontend
- Auto-logout quando expira
- Refresh automático ao retornar à aba

#### **Bcrypt**
**Por que escolhi:**
- Algoritmo de hash comprovadamente seguro
- Salt automático (protege contra rainbow tables)
- Computacionalmente custoso (proteção contra brute force)

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** 9+ (vem com Node.js)
- **Git** ([Download](https://git-scm.com/))

### 1. Clone o Repositório

```bash
git clone https://github.com/Shizuo0/ReferralSystem.git
cd ReferralSystem
```

### 2. Configurar Backend

```bash
# Navegar para pasta do backend
cd backend

# Instalar dependências
npm install

# Criar arquivo .env
cp .env.example .env

# Editar .env e configurar variáveis (JWT_SECRET é obrigatório)
# nano .env  # ou use seu editor preferido
```

**Conteúdo mínimo do `.env`:**
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=seu-segredo-super-secreto-aqui-mude-em-producao
JWT_EXPIRES_IN=24h
```

> ⚠️ **IMPORTANTE**: Gere um JWT_SECRET forte. Exemplo: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

```bash
# Iniciar servidor de desenvolvimento
npm run start:dev

# O backend estará rodando em http://localhost:3000
```

**Scripts disponíveis:**
```bash
npm run build         # Compilar TypeScript
npm run start         # Iniciar em produção
npm run start:dev     # Iniciar em desenvolvimento (watch mode)
npm test              # Executar testes
npm run db:reset      # Resetar banco de dados
npm run db:backup     # Fazer backup do banco
```

### 3. Configurar Frontend

**Em outro terminal:**

```bash
# Navegar para pasta do frontend
cd frontend

# Instalar dependências
npm install

# Criar arquivo .env
cp .env.example .env

# Editar .env (opcional, já vem com valor padrão)
# nano .env
```

**Conteúdo do `.env` (opcional):**
```env
VITE_API_URL=http://localhost:3000
```

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# O frontend estará rodando em http://localhost:5173
```

**Scripts disponíveis:**
```bash
npm run dev           # Iniciar em desenvolvimento
npm run build         # Build para produção
npm run preview       # Preview do build de produção
npm run lint          # Executar linter
```

### 4. Acessar a Aplicação

Abra seu navegador em: **http://localhost:5173**

### 5. Testar o Sistema de Indicação

1. **Registre o primeiro usuário** (ex: João)
2. **Faça login** com João
3. **Copie o link de indicação** da página de perfil
4. **Abra em aba anônima** ou faça logout
5. **Cole o link** (terá `?ref=CODIGO` na URL)
6. **Registre segundo usuário** (ex: Maria)
7. **Volte ao perfil de João** e veja a pontuação atualizada!

---

## 📁 Estrutura do Projeto

```
ReferralSystem/
├── backend/                      # API NestJS
│   ├── src/
│   │   ├── auth/                # Módulo de autenticação
│   │   │   ├── decorators/      # @Public, @CurrentUser
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── guards/          # JwtAuthGuard
│   │   │   └── interfaces/      # JwtPayload
│   │   ├── users/               # Módulo de usuários
│   │   │   ├── user.entity.ts   # Entidade User (TypeORM)
│   │   │   └── users.service.ts # Lógica de negócio
│   │   ├── common/              # Utilitários compartilhados
│   │   │   ├── filters/         # Exception filters
│   │   │   └── utils/           # Hash, ReferralCode
│   │   ├── database/            # Configuração do banco
│   │   └── main.ts              # Entry point
│   ├── database/                # Arquivos SQLite
│   ├── .env.example             # Template de variáveis
│   └── package.json
│
├── frontend/                     # SPA React
│   ├── src/
│   │   ├── components/          # Componentes reutilizáveis
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── SkeletonLoader.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── PrivateRoute.tsx
│   │   ├── contexts/            # Context API
│   │   │   ├── AuthContext.tsx  # Estado de autenticação
│   │   │   ├── LoadingContext.tsx
│   │   │   └── ToastContext.tsx
│   │   ├── pages/               # Páginas da aplicação
│   │   │   ├── Register.tsx     # Cadastro
│   │   │   ├── Login.tsx        # Login
│   │   │   ├── Profile.tsx      # Perfil
│   │   │   └── NotFound.tsx     # 404
│   │   ├── services/            # Integração com API
│   │   │   └── api.ts           # ApiService
│   │   ├── utils/               # Utilitários
│   │   │   ├── auth.ts          # JWT helpers
│   │   │   ├── cache.ts         # LocalStorage
│   │   │   └── errorHandler.ts  # Tratamento de erros
│   │   ├── config/              # Configurações
│   │   │   └── env.ts           # Validação de env vars
│   │   ├── types/               # TypeScript types
│   │   ├── App.tsx              # Componente raiz
│   │   └── main.tsx             # Entry point
│   ├── public/                  # Assets estáticos
│   ├── .env.example
│   └── package.json
│
└── README.md                     # Este arquivo
```

---

## 🤖 Colaboração com IA

Esta seção detalha como ferramentas de IA foram utilizadas no desenvolvimento deste projeto, conforme requisitado no desafio.

### Ferramenta Utilizada

**Cursor AI** - Editor de código com IA integrada (baseado em Claude 3.5 Sonnet)

### Como a IA Foi Utilizada

#### 1. **Planejamento e Arquitetura** (30% do tempo)

**O que pedi à IA:**
- "Analise os requisitos do desafio e crie um plano de issues para desenvolvimento incremental no GitHub"
- "Sugira a melhor arquitetura para separar backend e frontend"
- "Como organizar módulos no NestJS para este projeto?"

**O que aprendi:**
- **Planejamento incremental**: A IA sugeriu dividir o projeto em 10 issues bem definidas, facilitando tracking e commits atômicos
- **Separação de responsabilidades**: Entendi melhor como organizar código em modules (auth, users, common) no NestJS
- **Design patterns**: A IA explicou quando usar DTOs, guards, decorators e interceptors

**Resultado:**
Issues criadas no GitHub com commits incrementais, facilitando code review e rollback se necessário.

#### 2. **Implementação do Backend** (40% do tempo)

**O que pedi à IA:**
- "Crie um módulo de autenticação com JWT no NestJS"
- "Como implementar sistema de indicação com relacionamento self-referencing no TypeORM?"
- "Adicione validação de DTOs com class-validator"

**O que aprendi:**
- **TypeORM Relations**: Aprendi a criar relacionamentos recursivos (User → referredBy → User)
- **JWT Strategy**: Entendi como funciona Passport JWT strategy e como criar guards customizados
- **Exception Filters**: Como criar filtros globais para padronizar respostas de erro
- **Decorators customizados**: Criei `@Public()` e `@CurrentUser()` com ajuda da IA

**Código gerado com IA:**
```typescript
// Exemplo: Decorator @Public() sugerido pela IA
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// Uso em rotas:
@Public()
@Post('login')
async login(@Body() loginDto: LoginDto) { }
```

**Refinamento manual:**
- Ajustei validações para serem mais rigorosas
- Adicionei logs personalizados
- Otimizei queries do TypeORM

#### 3. **Implementação do Frontend** (35% do tempo)

**O que pedi à IA:**
- "Crie um contexto de autenticação com React Context API"
- "Como implementar validação de formulário sem bibliotecas externas?"
- "Crie skeleton loaders para melhor UX durante loading"

**O que aprendi:**
- **Context API avançada**: Aprendi a combinar múltiplos contexts (Auth, Loading, Toast) sem prop drilling
- **Custom Hooks**: Como criar hooks reutilizáveis (`useAuth`, `useToast`, `useLoading`)
- **Performance**: Uso correto de `useCallback` e `useMemo` para evitar re-renders
- **Validação client-side**: Regex robustos e feedback em tempo real

**Código gerado com IA:**
```typescript
// Exemplo: useAuth hook sugerido pela IA
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

**Refinamento manual:**
- Adicionei verificação periódica de token expirado (a cada 1min)
- Implementei sincronização entre abas com Storage Events
- Melhorei mensagens de erro para serem mais amigáveis

#### 4. **Estilização com CSS Puro** (25% do tempo)

**O que pedi à IA:**
- "Crie um design system com CSS variables para tema dark"
- "Como fazer animações suaves sem bibliotecas?"
- "Implemente glassmorphism nos cards"

**O que aprendi:**
- **CSS Variables**: Como criar tema consistente com `--primary-color`, `--spacing-*`, etc
- **Keyframe animations**: Aprendi `fadeIn`, `slideInUp`, `scaleIn`, `pulse`
- **Glassmorphism**: `backdrop-filter: blur()` com backgrounds semi-transparentes
- **Responsive design**: Media queries mobile-first
- **Acessibilidade CSS**: `prefers-reduced-motion`, `focus-visible`

**Código gerado com IA (depois refinado):**
```css
/* Design system sugerido pela IA */
:root {
  --primary-color: #8b5cf6;
  --bg-primary: #0a0a0f;
  --spacing-md: 16px;
  --transition-normal: 250ms;
}

/* Animação sugerida e refinada manualmente */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### 5. **Tratamento de Erros e Edge Cases** (20% do tempo)

**O que pedi à IA:**
- "Liste possíveis edge cases no sistema de autenticação"
- "Como tratar erro de localStorage cheio?"
- "Implemente retry logic para requests que falham"

**O que aprendi:**
- **Edge cases comuns**: Token expirado, localStorage indisponível, network offline, JSON inválido
- **Error boundaries**: Como criar componentes que pegam erros de renderização
- **Graceful degradation**: App continua funcionando mesmo sem localStorage
- **User feedback**: Toast notifications em vez de alerts

**Problemas que a IA me ajudou a prever:**
1. LocalStorage pode estar desabilitado (modo anônimo)
2. Token pode expirar durante uso (solução: verificação periódica)
3. Usuário pode estar offline (solução: mensagens claras)
4. JSON da API pode ser malformado (solução: try/catch no parse)

#### 6. **Otimização e Refatoração** (15% do tempo)

**O que pedi à IA:**
- "Analise o bundle size e sugira otimizações"
- "Como implementar code splitting?"
- "Revise performance de re-renders no React"

**O que aprendi:**
- **Lazy loading**: `React.lazy()` para carregar páginas sob demanda
- **Bundle analysis**: Como usar `npm run build` e analisar chunks
- **Memo optimization**: Quando usar `React.memo`, `useMemo`, `useCallback`
- **Tree shaking**: Imports nomeados em vez de default exports

**Otimizações implementadas:**
```typescript
// Lazy loading sugerido pela IA
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));

// Code splitting de utilitários
// errorHandler extraído como módulo separado (0.94 KB)
```

### Limitações da IA Encontradas

1. **Contexto limitado**: Às vezes a IA "esquecia" decisões anteriores, precisei relembrar
2. **Código genérico**: Algumas soluções eram muito básicas, precisei refinar
3. **Imports errados**: Ocasionalmente importava de paths incorretos
4. **Over-engineering**: Às vezes sugeria soluções complexas demais

### Como Contornei as Limitações

1. **Revisão crítica**: Nunca aceitei código cegamente, sempre entendi antes de usar
2. **Refinamento iterativo**: Pedia ajustes específicos: "torne isso mais simples"
3. **Testes manuais**: Testei cada funcionalidade implementada
4. **Documentação própria**: Comentei código para meu entendimento futuro

### Principais Aprendizados

#### Técnicos:
- ✅ NestJS é poderoso mas tem curva de aprendizado (IA acelerou muito)
- ✅ TypeScript previne muitos bugs que só veria em runtime
- ✅ Context API é suficiente para estado global (não precisa Redux para tudo)
- ✅ CSS puro é trabalhoso mas dá controle total

#### Sobre IA:
- ✅ **IA é assistente, não substituto**: Preciso entender o código gerado
- ✅ **Iteração é chave**: Primeira resposta raramente é perfeita
- ✅ **Contexto importa**: Quanto mais detalhe eu dava, melhor a resposta
- ✅ **Validação é essencial**: Sempre teste código gerado por IA

### Prompts Mais Úteis

1. **"Explique como se eu fosse iniciante"** → Respostas didáticas
2. **"Liste edge cases que devo tratar"** → Prevenção de bugs
3. **"Refatore este código para melhor performance"** → Otimização
4. **"Por que essa solução é melhor que X?"** → Entendimento profundo

### Conclusão

A IA foi fundamental para acelerar desenvolvimento, mas o **conhecimento técnico e pensamento crítico continuam essenciais**. Usei IA como **mentor experiente** que me guiou, mas as decisões finais e refinamentos foram meus.

**Porcentagem de código escrito por:**
- IA (bruto): ~60%
- Eu (refinamento e lógica específica): ~40%

**Porcentagem de aprendizado:**
- 100% meu! 🎓

---

## 📝 Licença

Este projeto foi desenvolvido como parte de um desafio técnico para processo seletivo de estágio.

---

## 👤 Autor

**Paulo Shizuo Vasconcelos Tatibana**
- GitHub: [@Shizuo0](https://github.com/Shizuo0)
- Email: paulosvtatibana@gmail.com

---

## 🙏 Agradecimentos

- **Cursor AI** - Por acelerar o desenvolvimento e ser excelente ferramenta de aprendizado
- **NestJS Team** - Pelo framework incrível e documentação exemplar
- **React Team** - Por tornar desenvolvimento frontend mais intuitivo

---