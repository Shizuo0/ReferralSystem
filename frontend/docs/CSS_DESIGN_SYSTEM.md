# Sistema de Design CSS

Este documento descreve o sistema de design CSS puro (sem frameworks) da aplicação.

## 📐 Variáveis CSS (CSS Variables)

Todas as variáveis estão definidas em `src/index.css` no seletor `:root`.

### Cores Principais

```css
--primary-color: #667eea
--primary-hover: #5568d3
--primary-active: #4a5bb8
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```

### Cores de Status

```css
/* Sucesso */
--success-color: #22c55e
--success-bg: #f0fdf4
--success-border: #22c55e

/* Erro */
--error-color: #ef4444
--error-bg: #fef2f2
--error-border: #ef4444

/* Informação e Aviso */
--info-color: #3b82f6
--warning-color: #f59e0b
```

### Cores de Texto

```css
--text-primary: #333       /* Texto principal */
--text-secondary: #666     /* Texto secundário */
--text-tertiary: #999      /* Texto terciário */
--text-light: #6b7280      /* Texto claro (hints) */
```

### Backgrounds

```css
--bg-white: #ffffff
--bg-light: #f9fafb
--bg-gray: #f3f4f6
```

### Borders

```css
--border-color: #d1d5db
--border-light: #e5e7eb
--border-dark: #9ca3af
```

### Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 40px rgba(0, 0, 0, 0.1)
--shadow-xl: 0 20px 50px rgba(0, 0, 0, 0.15)
```

### Espaçamentos

```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 12px
--spacing-lg: 16px
--spacing-xl: 20px
--spacing-2xl: 24px
--spacing-3xl: 30px
--spacing-4xl: 40px
```

### Border Radius

```css
--radius-sm: 4px
--radius-md: 6px
--radius-lg: 12px
--radius-xl: 16px
```

### Tipografia

```css
/* Família de Fonte */
--font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', ...

/* Tamanhos */
--font-size-xs: 12px
--font-size-sm: 14px
--font-size-base: 16px
--font-size-lg: 18px
--font-size-xl: 20px
--font-size-2xl: 24px
--font-size-3xl: 28px
--font-size-4xl: 32px

/* Pesos */
--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
```

### Transições

```css
--transition-fast: 150ms ease
--transition-base: 200ms ease
--transition-slow: 300ms ease
```

---

## 🎨 Componentes Globais

### Form Container

```html
<div class="form-container">
  <div class="form-card">
    <h1>Título</h1>
    <p class="subtitle">Subtítulo</p>
    <!-- conteúdo -->
  </div>
</div>
```

**Estilos:**
- Centralizado vertical e horizontalmente
- Background com gradiente primário
- Card branco com sombra
- Padding: 40px
- Max-width: 440px

### Form Group

```html
<div class="form-group">
  <label for="input">Label</label>
  <input type="text" id="input" placeholder="Placeholder" />
  <span class="error-message">Mensagem de erro</span>
  <small class="form-hint">Dica</small>
</div>
```

**Estados de Input:**
- `:focus` → borda azul + sombra
- `.input-error` → borda vermelha
- `:disabled` → opacidade reduzida

### Alertas

```html
<div class="alert alert-error">
  Mensagem de erro
</div>

<div class="alert alert-success">
  Mensagem de sucesso
</div>
```

### Botões

```html
<button class="btn btn-primary">Botão Primário</button>
<button class="btn btn-danger">Botão Perigo</button>
<button class="btn btn-success">Botão Sucesso</button>
```

**Estados:**
- `:hover` → escurece
- `:active` → escurece mais
- `:disabled` → cinza + cursor not-allowed

---

## 📱 Responsividade

### Breakpoints

```css
/* Mobile */
@media (max-width: 480px) {
  /* Ajustes para mobile */
}

/* Tablet */
@media (max-width: 768px) {
  /* Ajustes para tablet */
}

/* Desktop pequeno */
@media (max-width: 1024px) {
  /* Ajustes */
}
```

### Estratégia Mobile-First

- Padding reduzido em telas pequenas
- Fontes reduzidas (h1: 32px → 24px)
- Botões com largura 100% em mobile
- Touch targets mínimo de 44px

---

## ✨ Efeitos e Animações

### Transições Padrão

Todos os elementos interativos usam:
```css
transition: all var(--transition-base);
```

### Hover States

```css
button:hover {
  background-color: var(--primary-hover);
}

input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}
```

---

## 🎯 Boas Práticas

### 1. Use Variáveis CSS

❌ **Evite:**
```css
color: #667eea;
padding: 12px;
```

✅ **Prefira:**
```css
color: var(--primary-color);
padding: var(--spacing-md);
```

### 2. Consistência de Espaçamento

Use a escala de espaçamento definida:
- `xs` (4px) → espaços mínimos
- `sm` (8px) → gaps pequenos
- `md` (12px) → padding padrão
- `lg` (16px) → espaçamento entre elementos
- `xl` (20px) → padding de containers
- `2xl` a `4xl` → espaçamentos maiores

### 3. Hierarquia de Cores

- **Primária**: Ações principais, links
- **Sucesso**: Confirmações, mensagens positivas
- **Erro**: Validações, mensagens de erro
- **Texto**: Primário para títulos, secundário para parágrafos

### 4. Acessibilidade

- Contraste mínimo: 4.5:1 para texto
- Focus visível em todos os elementos interativos
- Touch targets mínimo: 44x44px (mobile)
- Labels associados a inputs

---

## 📂 Estrutura de Arquivos CSS

```
frontend/src/
├── index.css          # Variáveis globais + reset
├── App.css            # Componentes reutilizáveis
└── pages/
    ├── Login.css      # Estilos específicos do Login
    ├── Register.css   # Estilos específicos do Register
    └── Profile.css    # Estilos específicos do Profile
```

**Ordem de importação:**
1. `index.css` (global)
2. `App.css` (componentes)
3. Arquivos específicos das páginas

---

## 🔧 Classes Utilitárias

```css
.container          /* Container com max-width e padding */
.text-center        /* Texto centralizado */
.text-primary       /* Cor primária */
.text-error         /* Cor de erro */
.text-success       /* Cor de sucesso */
```

---

## 🎨 Paleta de Cores Completa

### Primária (Roxo/Azul)
- Base: `#667eea`
- Hover: `#5568d3`
- Active: `#4a5bb8`

### Secundária (Roxo)
- Base: `#764ba2` (usado no gradiente)

### Sucesso (Verde)
- Base: `#22c55e`
- Escuro: `#16a34a`
- Claro: `#15803d`

### Erro (Vermelho)
- Base: `#ef4444`
- Escuro: `#dc2626`

### Neutros (Cinzas)
- Texto principal: `#333`
- Texto secundário: `#666`
- Texto terciário: `#999`
- Bordas: `#d1d5db`
- Background: `#f9fafb`

---

## 📝 Exemplos de Uso

### Criar um Card

```css
.my-card {
  background: var(--bg-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-2xl);
}
```

### Criar um Botão Customizado

```css
.my-button {
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: white;
  background: var(--primary-color);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
}

.my-button:hover {
  background: var(--primary-hover);
}
```

### Input com Validação

```css
.my-input {
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  transition: all var(--transition-base);
}

.my-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.my-input.error {
  border-color: var(--error-color);
}
```

---

## 🚀 Próximas Melhorias

- [ ] Animações de entrada (fade-in, slide-in)
- [ ] Loading states animados
- [ ] Dark mode
- [ ] Mais componentes reutilizáveis
- [ ] Sistema de grid
- [ ] Mais classes utilitárias
