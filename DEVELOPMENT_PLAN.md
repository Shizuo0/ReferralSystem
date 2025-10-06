# 📋 Plano de Desenvolvimento - Sistema de Indicação

Este documento contém o planejamento completo das issues e commits incrementais para o projeto.

## 🎯 Visão Geral do Projeto

**Objetivo**: Criar uma aplicação web SPA que permita cadastro de usuários e implemente um sistema de pontos por indicação.

**Stack Tecnológica Escolhida**:
- **Backend**: NestJS + TypeORM + SQLite
- **Frontend**: React + Vite + TypeScript
- **Estilização**: CSS Puro (sem frameworks)

---

## 📝 Issues e Tarefas

### **Issue #1: Backend - Sistema de Autenticação e Registro de Usuário**
**Label**: `backend`, `authentication`

**Objetivo**: Implementar o endpoint de registro de novos usuários com validação e hash de senha.

**Subtarefas para commits incrementais**:
- [ ] 1.1 - Instalar e configurar bcrypt para hash de senhas
- [ ] 1.2 - Criar DTO de registro (RegisterDto) com validações usando class-validator
- [ ] 1.3 - Criar UsersService com método de criação de usuário
- [ ] 1.4 - Implementar geração de código de referral único (nanoid ou uuid curto)
- [ ] 1.5 - Criar AuthController com endpoint POST /auth/register
- [ ] 1.6 - Adicionar tratamento de erros (email duplicado, validações)
- [ ] 1.7 - Testar endpoint manualmente (Postman/Insomnia/curl)

**Critérios de Aceitação**:
- ✓ Usuário pode se registrar com nome, email e senha
- ✓ Senha é hasheada antes de salvar
- ✓ Código de referral único é gerado automaticamente
- ✓ Email duplicado retorna erro apropriado
- ✓ Validações de campo funcionam corretamente

---

### **Issue #2: Backend - Sistema de Login e Autenticação**
**Label**: `backend`, `authentication`

**Objetivo**: Implementar o endpoint de login para autenticação de usuários.

**Subtarefas para commits incrementais**:
- [ ] 2.1 - Criar DTO de login (LoginDto) com validações
- [ ] 2.2 - Implementar método de validação de credenciais no UsersService
- [ ] 2.3 - Criar endpoint POST /auth/login no AuthController
- [ ] 2.4 - Retornar dados do usuário (sem senha) após login bem-sucedido
- [ ] 2.5 - Adicionar tratamento de erros de autenticação (credenciais inválidas)

**Critérios de Aceitação**:
- ✓ Usuário pode fazer login com email e senha
- ✓ Credenciais são validadas corretamente
- ✓ Resposta não contém a senha
- ✓ Credenciais inválidas retornam erro apropriado

---

### **Issue #3: Backend - Sistema de Indicação (Referral)**
**Label**: `backend`, `feature`

**Objetivo**: Implementar a lógica de indicação, permitindo registro com código de referral e incremento de pontos.

**Subtarefas para commits incrementais**:
- [ ] 3.1 - Criar método para buscar usuário por código de referral
- [ ] 3.2 - Modificar endpoint de registro para aceitar código de referral opcional
- [ ] 3.3 - Implementar lógica de incremento de pontos do usuário que indicou
- [ ] 3.4 - Criar endpoint GET /users/profile/:id para buscar dados do usuário
- [ ] 3.5 - Criar método para buscar estatísticas de referral (pontos, total de indicações)
- [ ] 3.6 - Adicionar validação de código de referral inexistente
- [ ] 3.7 - Testar fluxo completo de indicação

**Critérios de Aceitação**:
- ✓ Usuário pode se registrar com código de referral
- ✓ Usuário que indicou ganha 1 ponto automaticamente
- ✓ Código inválido retorna erro apropriado
- ✓ Endpoint de perfil retorna dados corretos (nome, pontuação, código de referral)

---

### **Issue #4: Frontend - Configuração de Roteamento e Estrutura**
**Label**: `frontend`, `setup`

**Objetivo**: Configurar a estrutura base do frontend com roteamento e arquitetura de pastas.

**Subtarefas para commits incrementais**:
- [ ] 4.1 - Instalar react-router-dom
- [ ] 4.2 - Criar estrutura de pastas (pages, components, services, styles, types)
- [ ] 4.3 - Configurar rotas básicas no App.tsx (/register, /login, /profile)
- [ ] 4.4 - Criar arquivo de configuração de API (api.ts com fetch ou axios)
- [ ] 4.5 - Criar contexto de autenticação (AuthContext.tsx)
- [ ] 4.6 - Implementar provider de autenticação

**Critérios de Aceitação**:
- ✓ Navegação entre rotas funciona
- ✓ Estrutura de pastas organizada
- ✓ API client configurado
- ✓ Context API configurado para autenticação

---

### **Issue #5: Frontend - Página de Cadastro**
**Label**: `frontend`, `feature`

**Objetivo**: Criar a página de cadastro com validação frontend.

**Subtarefas para commits incrementais**:
- [ ] 5.1 - Criar componente RegisterPage com formulário HTML básico
- [ ] 5.2 - Adicionar campos controlados: nome, email, senha
- [ ] 5.3 - Implementar validação de email com regex
- [ ] 5.4 - Implementar validação de senha (min 8 chars, letras e números)
- [ ] 5.5 - Mostrar mensagens de erro de validação em tempo real
- [ ] 5.6 - Criar service para chamada da API de registro
- [ ] 5.7 - Integrar formulário com API backend
- [ ] 5.8 - Adicionar feedback de sucesso/erro após submissão
- [ ] 5.9 - Implementar redirecionamento para /profile após registro bem-sucedido

**Critérios de Aceitação**:
- ✓ Formulário valida email corretamente
- ✓ Formulário valida senha (8+ chars, letras e números)
- ✓ Mensagens de erro são exibidas
- ✓ Registro é enviado para API
- ✓ Redirecionamento funciona após sucesso

---

### **Issue #6: Frontend - Página de Login**
**Label**: `frontend`, `feature`

**Objetivo**: Criar a página de login para autenticação.

**Subtarefas para commits incrementais**:
- [ ] 6.1 - Criar componente LoginPage com formulário
- [ ] 6.2 - Adicionar campos controlados: email e senha
- [ ] 6.3 - Criar service para chamada da API de login
- [ ] 6.4 - Integrar com AuthContext para salvar estado de autenticação
- [ ] 6.5 - Salvar dados do usuário no localStorage
- [ ] 6.6 - Implementar redirecionamento para /profile após login
- [ ] 6.7 - Adicionar link para página de registro

**Critérios de Aceitação**:
- ✓ Usuário pode fazer login
- ✓ Estado de autenticação é persistido
- ✓ Redirecionamento funciona
- ✓ Erros são exibidos apropriadamente

---

### **Issue #7: Frontend - Página de Perfil**
**Label**: `frontend`, `feature`

**Objetivo**: Criar a página de perfil mostrando dados do usuário e link de indicação.

**Subtarefas para commits incrementais**:
- [ ] 7.1 - Criar componente ProfilePage com estrutura básica
- [ ] 7.2 - Buscar dados do usuário da API ao carregar página
- [ ] 7.3 - Exibir nome do usuário
- [ ] 7.4 - Exibir pontuação atual
- [ ] 7.5 - Gerar URL de indicação completa (com código)
- [ ] 7.6 - Exibir link de indicação na página
- [ ] 7.7 - Criar botão "Copiar Link"
- [ ] 7.8 - Implementar funcionalidade de copiar para clipboard (navigator.clipboard)
- [ ] 7.9 - Adicionar feedback visual ao copiar (mensagem temporária)
- [ ] 7.10 - Adicionar botão de logout

**Critérios de Aceitação**:
- ✓ Dados do usuário são exibidos corretamente
- ✓ Link de indicação é gerado com código correto
- ✓ Botão copiar funciona
- ✓ Feedback visual é mostrado
- ✓ Logout funciona

---

### **Issue #8: Frontend - Sistema de Indicação na Página de Cadastro**
**Label**: `frontend`, `feature`

**Objetivo**: Implementar detecção de código de referral na URL e registro com indicação.

**Subtarefas para commits incrementais**:
- [ ] 8.1 - Detectar parâmetro de referral na URL (query string: ?ref=CODIGO)
- [ ] 8.2 - Extrair código de referral usando URLSearchParams
- [ ] 8.3 - Armazenar código temporariamente no state
- [ ] 8.4 - Exibir mensagem informando quem está indicando (se código válido)
- [ ] 8.5 - Enviar código de referral junto com dados de registro para API
- [ ] 8.6 - Adicionar feedback visual quando cadastro é por indicação
- [ ] 8.7 - Tratar erro se código de referral for inválido

**Critérios de Aceitação**:
- ✓ Código de referral é detectado na URL
- ✓ Mensagem de indicação é exibida
- ✓ Código é enviado para API no registro
- ✓ Erros de código inválido são tratados

---

### **Issue #9: Estilização CSS - Reset e Variáveis Globais**
**Label**: `frontend`, `styling`

**Objetivo**: Criar a base de estilização com reset e variáveis CSS.

**Subtarefas para commits incrementais**:
- [ ] 9.1 - Criar arquivo reset.css com reset básico
- [ ] 9.2 - Criar arquivo variables.css com variáveis CSS
- [ ] 9.3 - Definir paleta de cores (primária, secundária, neutras)
- [ ] 9.4 - Definir tipografia (font-family, tamanhos, pesos)
- [ ] 9.5 - Definir espaçamentos e breakpoints para responsividade
- [ ] 9.6 - Importar arquivos no index.css

**Critérios de Aceitação**:
- ✓ Reset CSS aplicado
- ✓ Variáveis CSS definidas
- ✓ Tipografia configurada
- ✓ Sistema de cores consistente

---

### **Issue #10: Estilização CSS - Página de Cadastro**
**Label**: `frontend`, `styling`

**Objetivo**: Estilizar a página de cadastro com CSS puro responsivo.

**Subtarefas para commits incrementais**:
- [ ] 10.1 - Criar arquivo RegisterPage.css
- [ ] 10.2 - Estilizar container principal (centralizado, card)
- [ ] 10.3 - Estilizar formulário (espaçamento, alinhamento)
- [ ] 10.4 - Estilizar inputs (borda, padding, focus state)
- [ ] 10.5 - Estilizar labels e mensagens de erro
- [ ] 10.6 - Estilizar botão de submit (cores, hover, active)
- [ ] 10.7 - Adicionar animações de validação
- [ ] 10.8 - Implementar responsividade para mobile (max-width: 768px)
- [ ] 10.9 - Testar em diferentes tamanhos de tela

**Critérios de Aceitação**:
- ✓ Design moderno e limpo
- ✓ Estados visuais claros (hover, focus, error)
- ✓ Totalmente responsivo
- ✓ Sem uso de frameworks CSS

---

### **Issue #11: Estilização CSS - Página de Login**
**Label**: `frontend`, `styling`

**Objetivo**: Estilizar a página de login mantendo consistência visual.

**Subtarefas para commits incrementais**:
- [ ] 11.1 - Criar arquivo LoginPage.css
- [ ] 11.2 - Aplicar estilos similares ao cadastro (consistência)
- [ ] 11.3 - Estilizar campos específicos do login
- [ ] 11.4 - Implementar responsividade para mobile
- [ ] 11.5 - Testar em diferentes tamanhos de tela

**Critérios de Aceitação**:
- ✓ Visual consistente com página de cadastro
- ✓ Totalmente responsivo
- ✓ Sem uso de frameworks CSS

---

### **Issue #12: Estilização CSS - Página de Perfil**
**Label**: `frontend`, `styling`

**Objetivo**: Estilizar a página de perfil com destaque para pontuação e link de indicação.

**Subtarefas para commits incrementais**:
- [ ] 12.1 - Criar arquivo ProfilePage.css
- [ ] 12.2 - Estilizar container de perfil (card centralizado)
- [ ] 12.3 - Estilizar exibição de nome (título)
- [ ] 12.4 - Estilizar exibição de pontuação (badge, destaque visual)
- [ ] 12.5 - Estilizar área de link de indicação (input readonly + botão)
- [ ] 12.6 - Estilizar botão "Copiar Link" (hover, active)
- [ ] 12.7 - Adicionar animação ao copiar (feedback visual)
- [ ] 12.8 - Estilizar botão de logout
- [ ] 12.9 - Implementar responsividade para mobile
- [ ] 12.10 - Testar em diferentes tamanhos de tela

**Critérios de Aceitação**:
- ✓ Design atraente e funcional
- ✓ Pontuação tem destaque visual
- ✓ Animação de copiar é suave
- ✓ Totalmente responsivo
- ✓ Sem uso de frameworks CSS

---

### **Issue #13: Melhorias de UX e Polimento**
**Label**: `frontend`, `enhancement`

**Objetivo**: Adicionar melhorias de experiência do usuário e polimentos finais.

**Subtarefas para commits incrementais**:
- [ ] 13.1 - Adicionar loading states em formulários (spinner/disable button)
- [ ] 13.2 - Melhorar mensagens de erro (mais amigáveis e claras)
- [ ] 13.3 - Implementar proteção de rotas (redirect para /login se não autenticado)
- [ ] 13.4 - Adicionar transições suaves entre páginas
- [ ] 13.5 - Adicionar favicon personalizado
- [ ] 13.6 - Testar fluxo completo da aplicação

**Critérios de Aceitação**:
- ✓ Loading states funcionam
- ✓ Rotas protegidas corretamente
- ✓ Experiência fluida e polida
- ✓ Sem bugs visuais

---

### **Issue #14: Documentação - README.md Principal**
**Label**: `documentation`

**Objetivo**: Criar documentação completa do projeto.

**Subtarefas para commits incrementais**:
- [ ] 14.1 - Escrever descrição do projeto e objetivos
- [ ] 14.2 - Documentar funcionalidades principais
- [ ] 14.3 - Listar tecnologias utilizadas (backend e frontend)
- [ ] 14.4 - Justificar escolhas de tecnologias
- [ ] 14.5 - Escrever instruções de instalação (backend e frontend)
- [ ] 14.6 - Escrever instruções de execução
- [ ] 14.7 - Adicionar screenshots ou GIFs da aplicação
- [ ] 14.8 - Adicionar seção de estrutura de pastas

**Critérios de Aceitação**:
- ✓ README claro e completo
- ✓ Instruções fáceis de seguir
- ✓ Justificativas bem elaboradas
- ✓ Formatação markdown correta

---

### **Issue #15: Documentação - Seção "Colaboração com IA"**
**Label**: `documentation`

**Objetivo**: Documentar o uso de IA no desenvolvimento do projeto (requisito obrigatório).

**Subtarefas para commits incrementais**:
- [ ] 15.1 - Criar seção "Colaboração com IA" no README
- [ ] 15.2 - Documentar uso de IA no planejamento e estruturação
- [ ] 15.3 - Documentar uso de IA no desenvolvimento do backend
- [ ] 15.4 - Documentar uso de IA no desenvolvimento do frontend
- [ ] 15.5 - Documentar uso de IA na estilização CSS
- [ ] 15.6 - Refletir sobre aprendizados e insights obtidos
- [ ] 15.7 - Documentar limitações e desafios encontrados

**Critérios de Aceitação**:
- ✓ Seção detalhada e honesta
- ✓ Exemplos específicos de uso
- ✓ Reflexão sobre aprendizados
- ✓ Demonstra compreensão do código gerado

---

## 🎯 Ordem Sugerida de Execução

1. **Fase 1 - Backend Core** (Issues #1, #2, #3)
2. **Fase 2 - Frontend Setup** (Issue #4)
3. **Fase 3 - Frontend Features** (Issues #5, #6, #7, #8)
4. **Fase 4 - Estilização** (Issues #9, #10, #11, #12)
5. **Fase 5 - Polimento** (Issue #13)
6. **Fase 6 - Documentação** (Issues #14, #15)

---

## 📝 Template de Commit

Sugestão de formato para commits incrementais:

```
<tipo>: <descrição curta>

<corpo opcional explicando o que foi feito>

Issue: #<número da issue>
```

**Tipos sugeridos**:
- `feat`: Nova funcionalidade
- `style`: Estilização
- `refactor`: Refatoração de código
- `docs`: Documentação
- `test`: Testes
- `fix`: Correção de bug
- `chore`: Tarefas gerais (deps, config)

**Exemplo**:
```
feat: Add password hashing with bcrypt

Implemented bcrypt to hash user passwords before storing in database.
Added bcryptjs dependency and created utility function for hashing.

Issue: #1
```

---

## ✅ Checklist Final

Antes de considerar o projeto completo:

- [ ] Todos os requisitos funcionais implementados
- [ ] Validações frontend funcionando
- [ ] Sistema de indicação completo (pontos, link, registro)
- [ ] Estilização CSS pura (sem frameworks)
- [ ] Design responsivo (mobile e desktop)
- [ ] README.md completo com justificativas
- [ ] Seção "Colaboração com IA" documentada
- [ ] Código limpo e organizado
- [ ] Projeto executa sem erros
- [ ] Testado manualmente (fluxo completo)

---

**Boa sorte no desenvolvimento! 🚀**
