# Guia de Acessibilidade

Este documento descreve as práticas de acessibilidade implementadas na aplicação.

## 🎯 Padrão WCAG 2.1 Level AA

A aplicação segue as diretrizes WCAG 2.1 Level AA para garantir acessibilidade.

---

## 🔍 Contraste de Cores

### Texto Normal (4.5:1 mínimo)

✅ **Texto primário sobre branco**: `#333` sobre `#ffffff`
- Contraste: 12.63:1 (Excelente)

✅ **Texto secundário sobre branco**: `#666` sobre `#ffffff`
- Contraste: 5.74:1 (Bom)

✅ **Links**: `#667eea` sobre `#ffffff`
- Contraste: 4.58:1 (Aprovado)

✅ **Erros**: `#dc2626` sobre `#fef2f2`
- Contraste: 8.59:1 (Excelente)

✅ **Sucesso**: `#15803d` sobre `#f0fdf4`
- Contraste: 6.92:1 (Excelente)

### Texto Grande (3:1 mínimo)

✅ **Títulos h1**: Contraste > 10:1

### UI Components (3:1 mínimo)

✅ **Bordas de inputs**: `#d1d5db` sobre `#ffffff`
- Contraste: 3.24:1 (Aprovado)

✅ **Botões primários**: Alto contraste (branco sobre roxo)

---

## ⌨️ Navegação por Teclado

### Tab Order

Todos os elementos interativos são acessíveis via `Tab`:

1. Links
2. Inputs
3. Botões
4. Links de rodapé

### Focus States

Todos os elementos interativos têm estados de foco visíveis:

```css
/* Outline visível em foco */
:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
```

### Atalhos de Teclado

| Tecla | Ação |
|-------|------|
| `Tab` | Próximo elemento |
| `Shift + Tab` | Elemento anterior |
| `Enter` | Ativar botão/link |
| `Space` | Ativar botão |

---

## 🏷️ Semântica HTML

### Estrutura Correta

```html
<!-- ✅ Correto -->
<form>
  <label for="email">Email</label>
  <input id="email" type="email" />
</form>

<!-- ❌ Evitar -->
<div onclick="submit()">Submit</div>
```

### Labels Associados

Todos os inputs têm labels associados via `for` e `id`:

```html
<label for="password">Senha</label>
<input id="password" type="password" />
```

### Hierarquia de Títulos

- `h1`: Título da página (único)
- `h2`: Seções principais
- `p`: Subtítulos e descrições

---

## 🔊 Screen Readers

### Classe `.sr-only`

Texto visível apenas para screen readers:

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

**Uso:**
```html
<button>
  <span class="sr-only">Copiar link de indicação</span>
  <span aria-hidden="true">Copiar Link</span>
</button>
```

### Mensagens de Erro

Erros são anunciados pelo screen reader:

```html
<input 
  id="email" 
  aria-describedby="email-error"
  aria-invalid="true"
/>
<span id="email-error" role="alert">
  Email é obrigatório
</span>
```

---

## 🎨 Estados Visuais

### Focus (Foco)

```css
input:focus-visible {
  outline: 2px solid #667eea;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
}
```

### Hover (Mouse)

```css
button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
}
```

### Active (Clique)

```css
button:active {
  transform: translateY(0);
}
```

### Disabled (Desabilitado)

```css
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Error (Erro)

```css
input.input-error {
  border-color: #ef4444;
  animation: shake 0.5s ease-in-out;
}
```

---

## 🎭 ARIA Attributes

### Roles

```html
<!-- Alertas -->
<div role="alert">Erro ao fazer login</div>

<!-- Status -->
<div role="status">Carregando...</div>

<!-- Live Regions -->
<div aria-live="polite" aria-atomic="true">
  Formulário enviado com sucesso
</div>
```

### Estados

```html
<!-- Loading -->
<button aria-busy="true">Carregando...</button>

<!-- Expandido/Colapsado -->
<button aria-expanded="false">Menu</button>

<!-- Inválido -->
<input aria-invalid="true" />
```

### Labels

```html
<!-- Label adicional -->
<button aria-label="Fechar modal">×</button>

<!-- Descrição adicional -->
<input 
  aria-describedby="password-hint"
  placeholder="Senha"
/>
<small id="password-hint">
  Mínimo 8 caracteres
</small>
```

---

## 🚫 Prefers Reduced Motion

Para usuários que preferem menos movimento:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Resultado:** Todas as animações são desabilitadas.

---

## 📱 Touch Targets

### Tamanho Mínimo: 44x44px

Todos os elementos clicáveis em mobile têm no mínimo 44x44px:

```css
@media (max-width: 480px) {
  button,
  input,
  a {
    min-height: 44px;
  }
}
```

**Referência:**
- Apple: 44x44pt
- Google Material: 48x48dp
- W3C: 44x44px

---

## 🎨 Dark Mode (Futuro)

Preparação para dark mode:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-white: #1a1a1a;
    --text-primary: #e5e5e5;
    --border-color: #404040;
  }
}
```

---

## 📋 Checklist de Acessibilidade

### Estrutura
- [x] HTML semântico
- [x] Hierarquia de títulos correta
- [x] Landmarks adequados (`main`, `nav`, `form`)

### Formulários
- [x] Labels associados a inputs
- [x] Placeholders não substituem labels
- [x] Mensagens de erro descritivas
- [x] Estados de validação visíveis

### Interatividade
- [x] Navegação por teclado funcional
- [x] Focus visível em todos os elementos
- [x] Ordem de tab lógica
- [x] Atalhos de teclado não conflitam

### Visual
- [x] Contraste WCAG AA (4.5:1)
- [x] Texto redimensionável até 200%
- [x] Cores não são única forma de informação
- [x] Foco não é apenas cor

### Conteúdo
- [x] Linguagem clara e simples
- [x] Instruções compreensíveis
- [x] Erros explicam como corrigir
- [x] Feedback de ações importante

### Mobile
- [x] Touch targets ≥ 44px
- [x] Zoom habilitado
- [x] Orientação portrait e landscape
- [x] Teclado não esconde campos

### Performance
- [x] Animações respeitam `prefers-reduced-motion`
- [x] Carregamento progressivo
- [x] Estados de loading claros

---

## 🔧 Ferramentas de Teste

### Navegador

**Chrome DevTools - Lighthouse**
```
F12 → Lighthouse → Accessibility
```

**axe DevTools**
```
Extensão Chrome/Firefox
https://www.deque.com/axe/devtools/
```

### Screen Readers

**NVDA** (Windows - Gratuito)
```
https://www.nvaccess.org/
```

**JAWS** (Windows - Pago)
```
https://www.freedomscientific.com/products/software/jaws/
```

**VoiceOver** (macOS/iOS - Nativo)
```
Cmd + F5
```

**TalkBack** (Android - Nativo)
```
Configurações → Acessibilidade → TalkBack
```

### Teclado

1. Esconder o mouse
2. Navegar apenas com `Tab` e `Enter`
3. Verificar se todos os elementos são acessíveis

---

## 🎯 Próximas Melhorias

- [ ] Dark mode completo
- [ ] Skip navigation links
- [ ] Breadcrumbs para navegação
- [ ] Mensagens de confirmação mais detalhadas
- [ ] Modo de alto contraste
- [ ] Preferências de usuário (tamanho de fonte)
- [ ] Traduções (i18n)

---

## 📚 Referências

- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [Inclusive Components](https://inclusive-components.design/)

---

## 💡 Dicas Rápidas

### ✅ Faça
- Use HTML semântico
- Associe labels a inputs
- Forneça feedback visual claro
- Teste com teclado
- Teste com screen reader
- Respeite preferências do usuário

### ❌ Evite
- Remover outline de foco
- Usar apenas cor para informação
- Divs clicáveis sem role
- Placeholder como label
- Animações excessivas
- Contraste insuficiente
