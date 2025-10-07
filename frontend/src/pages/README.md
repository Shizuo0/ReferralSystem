# Páginas do Frontend

Esta pasta contém todas as páginas da aplicação.

## Estrutura Atual

### Register.tsx
Página de cadastro de novos usuários.

**Funcionalidades:**
- Formulário com campos: nome, email e senha
- Validação em tempo real:
  - Nome: mínimo 3 caracteres
  - Email: formato válido
  - Senha: mínimo 8 caracteres, com letras e números
- Estados de erro por campo
- Feedback visual (campos com erro em vermelho)
- Hints informativos
- Captura de código de indicação via URL (`?ref=CODIGO`)
- Feedback visual quando há código de indicação
- Integração com API de registro
- Navegação automática para perfil após sucesso
- Link para página de login

**Estados:**
- `formData`: dados do formulário
- `errors`: erros de validação
- `touched`: campos que o usuário já interagiu
- `isLoading`: estado de carregamento da API
- `apiError`: erros retornados pela API
- `referralInfo`: mensagem de indicação quando há código na URL

**Validações:**
- `validateName()`: nome completo obrigatório
- `validateEmail()`: formato de email válido
- `validatePassword()`: senha forte

**Fluxo:**
1. Usuário acessa (opcionalmente com `?ref=CODIGO`)
2. Preenche formulário
3. Validação em tempo real
4. Submit → API
5. Sucesso → Salva token → Redireciona para `/profile`

---

### Profile.tsx
Página de perfil do usuário autenticado.

**Funcionalidades:**
- Proteção de rota (requer autenticação)
- Carregamento automático dos dados do perfil via API
- Exibição de:
  - Nome do usuário
  - Email do usuário
  - Pontuação atual (com mensagem contextual)
  - Link de indicação único
- Botão "Copiar Link" com feedback visual
- Botão de Logout
- Tratamento de erros (token inválido/expirado)
- Estados de loading e erro

**Estados:**
- `profile`: dados do perfil (nome, email, score, referralLink, etc.)
- `isLoading`: carregando dados
- `error`: mensagem de erro
- `copySuccess`: feedback de cópia do link

**Fluxo de autenticação:**
1. Verifica token no localStorage
2. Se não tem → Redireciona para `/login`
3. Se tem → Chama API `/user/profile`
4. Sucesso → Exibe dados
5. Erro 401 → Remove token → Redireciona para `/login`

**Feedback visual:**
- Loading: "Carregando perfil..."
- Erro: Mensagem + botão "Ir para Login"
- Sucesso: Card com informações + score destacado
- Cópia do link: Botão muda para verde "✓ Copiado!"

---

### Login.tsx
Página de autenticação para usuários existentes.

**Funcionalidades:**
- Formulário com campos: email e senha
- Validação em tempo real:
  - Email: formato válido e obrigatório
  - Senha: obrigatória
- Estados de erro por campo
- Feedback visual (campos com erro em vermelho)
- Integração com API de login
- Navegação automática para perfil após sucesso
- Redirecionamento automático se já estiver logado
- Link para página de cadastro

**Estados:**
- `formData`: dados do formulário (email, password)
- `errors`: erros de validação
- `touched`: campos que o usuário já interagiu
- `isLoading`: estado de carregamento da API
- `apiError`: erros retornados pela API

**Validações:**
- `validateEmail()`: formato de email válido
- `validatePassword()`: senha obrigatória

**Fluxo:**
1. Verifica se já tem token → Se sim, redireciona para `/profile`
2. Usuário preenche email e senha
3. Validação em tempo real
4. Submit → API
5. Sucesso → Salva token → Redireciona para `/profile`
6. Erro → Exibe mensagem de erro

**Proteção:**
- Se usuário já está autenticado (tem token), é redirecionado automaticamente para o perfil

---

## Convenções

### Estrutura de um componente de página:

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NomeDaPagina.css';

function NomeDaPagina() {
  const navigate = useNavigate();

  // Estados
  const [data, setData] = useState();

  // Funções
  const handleAction = () => {
    // ...
  };

  // Render
  return (
    <div className="nome-container">
      {/* Conteúdo */}
    </div>
  );
}

export default NomeDaPagina;
```

### CSS:

Cada página deve ter seu próprio arquivo CSS com:
- Container principal com background gradient
- Card centralizado com shadow
- Responsividade mobile (`@media max-width: 768px`)
- Estados de hover/focus
- Feedback visual claro
- Cores consistentes (primária: #667eea, erro: #ef4444, sucesso: #22c55e)

---

## Navegação

Estrutura de rotas (atual):

```
/                  → Redireciona para /register
/register          → Página de cadastro
/profile           → Página de perfil (autenticada)
/login             → Página de login (planejada)
```

### Proteção de rotas:

**Rotas públicas:**
- `/register`
- `/login`

**Rotas protegidas:**
- `/profile` (requer token JWT válido)

### Fluxos de navegação:

**Novo usuário:**
```
/register → Preenche formulário → /profile (com token)
```

**Com indicação:**
```
/register?ref=CODIGO → Preenche formulário → /profile (indicador ganha +1 ponto)
```

**Sem token válido:**
```
/profile → Verifica token → Inválido → /login
```

---

## APIs Utilizadas

### Register.tsx
- `POST /auth/register` (via `ApiService.register()`)

### Login.tsx
- `POST /auth/login` (via `ApiService.login()`)

### Profile.tsx
- `GET /user/profile` (via `ApiService.getProfile()`)
  - Requer header: `Authorization: Bearer <token>`
 → Remove token → /login
```

---

## APIs Utilizadas

### Register.tsx
- `POST /auth/register` (via `ApiService.register()`)

### Profile.tsx
- `GET /user/profile` (via `ApiService.getProfile()`)
  - Requer header: `Authorization: Bearer <token>`
