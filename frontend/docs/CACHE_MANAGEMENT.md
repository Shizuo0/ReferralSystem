# 🧹 Sistema de Gerenciamento de Cache Automático

## Visão Geral

O sistema agora possui **limpeza automática de cache** que elimina a necessidade de abrir o DevTools (F12) e executar comandos manualmente.

## ✨ Recursos Automáticos

### 1️⃣ **Limpeza Automática na Página de Registro**

Quando você acessa a página `/register`:
- ✅ Detecta automaticamente se há uma sessão ativa (token)
- ✅ Limpa localStorage, sessionStorage e cookies
- ✅ Exibe notificação visual por 5 segundos
- ✅ Permite criar nova conta sem conflitos

**Notificação exibida:**
```
✓ Sessão anterior limpa automaticamente. Pronto para criar nova conta!
```

### 2️⃣ **Limpeza Após Criar Conta**

Quando você cria uma nova conta:
- ✅ Limpa automaticamente todo o cache
- ✅ Garante que não há token de outro usuário
- ✅ Redireciona para `/login` com sessão limpa

### 3️⃣ **Botão de Limpeza Manual**

Na página de login, se houver erro:
- ✅ Aparece botão "🔄 Limpar Cache e Tentar Novamente"
- ✅ Um clique limpa tudo e recarrega a página
- ✅ Não precisa abrir o console do navegador

### 4️⃣ **Logout Completo**

Quando você faz logout:
- ✅ Remove token
- ✅ Limpa todo o cache
- ✅ Redireciona para `/login`

---

## 🛠️ Utilitário de Cache

Criado arquivo `frontend/src/utils/cache.ts` com funções reutilizáveis:

### Funções Disponíveis

```typescript
// Limpar tudo (localStorage, sessionStorage, cookies)
clearAllCache(): void

// Verificar se há sessão ativa
hasActiveSession(): boolean

// Limpar apenas token de autenticação
clearAuthToken(): void

// Obter token
getAuthToken(): string | null

// Salvar token
setAuthToken(token: string): void
```

### Exemplo de Uso

```typescript
import { clearAllCache, hasActiveSession } from '../utils/cache';

// Verificar sessão
if (hasActiveSession()) {
  console.log('Usuário logado');
}

// Limpar tudo
clearAllCache();
```

---

## 🎯 Fluxos Automáticos

### Fluxo 1: Criar Nova Conta

```
1. Usuário acessa /register
   └─> Sistema detecta sessão antiga? 
       ├─> SIM: Limpa automaticamente + mostra notificação
       └─> NÃO: Continua normalmente

2. Usuário preenche formulário

3. Sistema cria conta
   └─> Limpa cache automaticamente
   └─> Redireciona para /login

4. Usuário faz login
   └─> Salva novo token
   └─> Redireciona para /profile
```

### Fluxo 2: Link de Indicação

```
1. Usuário A compartilha link: /register?ref=USUA1234

2. Usuário B clica no link
   └─> Sistema detecta token do Usuário A?
       └─> SIM: Limpa automaticamente
           └─> Notificação: "Sessão anterior limpa"
           └─> Mensagem: "🎉 Você foi indicado!"

3. Usuário B cria conta
   └─> Limpa cache
   └─> Score do Usuário A incrementa
   └─> Redireciona para /login

4. Usuário B faz login
   └─> Vê SEU PRÓPRIO perfil (não do Usuário A)
```

### Fluxo 3: Erro de Login

```
1. Usuário tenta login
   └─> Erro: "Usuário não encontrado"
   └─> Aparece botão laranja

2. Usuário clica em "🔄 Limpar Cache e Tentar Novamente"
   └─> Limpa tudo
   └─> Recarrega página
   └─> Pronto para nova tentativa
```

---

## 🔍 O que é Limpo?

Quando o sistema executa `clearAllCache()`:

✅ **localStorage** - Onde fica o token JWT  
✅ **sessionStorage** - Dados temporários da sessão  
✅ **Cookies** - Cookies do domínio atual  

**IMPORTANTE:** Não afeta:
- ❌ Cache do navegador (imagens, CSS, JS)
- ❌ Histórico de navegação
- ❌ Senhas salvas
- ❌ Dados de outros sites

---

## 📋 Quando NÃO Usar F12

Você **NÃO precisa mais** abrir o console (F12) e executar comandos manuais:

### ❌ Antes (Manual)
```javascript
// F12 > Console
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### ✅ Agora (Automático)
- Apenas acesse `/register` → Limpeza automática
- Ou clique no botão "Limpar Cache" no login
- Ou faça logout normalmente

---

## 🧪 Testando o Sistema

### Teste 1: Sessão Antiga Detectada

1. Faça login como Usuário A
2. Vá para `/register`
3. ✅ Deve aparecer: "Sessão anterior limpa automaticamente"

### Teste 2: Link de Indicação

1. Copie link de indicação do Usuário A
2. Cole no navegador (enquanto logado como A)
3. ✅ Deve limpar sessão automaticamente
4. Crie conta do Usuário B
5. ✅ Deve redirecionar para `/login`
6. Faça login como B
7. ✅ Deve ver perfil do Usuário B (não A)

### Teste 3: Botão de Limpeza

1. Tente fazer login com dados inválidos
2. ✅ Deve aparecer botão laranja
3. Clique no botão
4. ✅ Página recarrega com cache limpo

---

## 💡 Benefícios

✅ **UX Melhorada** - Não precisa saber usar DevTools  
✅ **Menos Erros** - Limpeza automática evita conflitos  
✅ **Mais Seguro** - Logout completo remove todos os dados  
✅ **Código Limpo** - Funções reutilizáveis centralizadas  
✅ **Notificações Visuais** - Usuário sabe o que está acontecendo  

---

## 🔧 Manutenção

### Adicionar Nova Funcionalidade de Limpeza

```typescript
// Importar utilitário
import { clearAllCache } from '../utils/cache';

// Usar quando necessário
const handleAction = () => {
  // ... sua lógica
  clearAllCache(); // Limpa tudo
  // ... continua
};
```

### Verificar Sessão Antes de Ação

```typescript
import { hasActiveSession, getAuthToken } from '../utils/cache';

if (hasActiveSession()) {
  const token = getAuthToken();
  // Fazer chamada autenticada
} else {
  // Redirecionar para login
}
```

---

## 📚 Referências

- **Arquivo utilitário**: `frontend/src/utils/cache.ts`
- **Usado em**:
  - `pages/Register.tsx` - Limpeza automática
  - `pages/Login.tsx` - Botão manual + salvar token
  - `pages/Profile.tsx` - Verificar token + logout
- **Guia de teste**: `TESTE-INDICACAO.md`
- **Troubleshooting**: `TROUBLESHOOTING.md`