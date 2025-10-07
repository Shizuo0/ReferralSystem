# Guia de Responsividade

Este documento descreve a estratégia de design responsivo da aplicação.

## 📱 Breakpoints

### Desktop (> 768px)
- Layout padrão
- Cards com largura máxima definida
- Padding generoso
- Fontes em tamanho completo

### Tablet (≤ 768px)
- Redução de padding
- Ajuste de fontes
- Cards ocupam mais largura
- Touch targets otimizados

### Mobile (≤ 480px)
- Layout simplificado
- Botões full-width
- Fontes reduzidas
- Touch targets mínimo 44px
- Padding reduzido

### Mobile Landscape (≤ 768px e landscape)
- Redução de altura vertical
- Scroll otimizado
- Padding ajustado

### Dispositivos Pequenos (≤ 375px)
- iPhone SE, iPhone 5/5S
- Fontes ainda menores
- Padding mínimo

---

## 🎯 Touch Targets

Todos os elementos interativos em mobile têm **mínimo 44x44px** (recomendação Apple/Google):

### Inputs
```css
@media (max-width: 480px) {
  input {
    min-height: 44px;
  }
}
```

### Botões
```css
@media (max-width: 480px) {
  button {
    min-height: 44px;
    width: 100%;
  }
}
```

### Links e Ícones
Espaçamento generoso ao redor de elementos clicáveis.

---

## 📐 Espaçamentos Responsivos

### Desktop
- Container padding: 20px (`--spacing-xl`)
- Card padding: 40px (`--spacing-4xl`)
- Form gap: 20px

### Tablet (768px)
- Container padding: 12px (`--spacing-md`)
- Card padding: 30px (`--spacing-3xl`)
- Form gap: 16px

### Mobile (480px)
- Container padding: 8px (`--spacing-sm`)
- Card padding: 24px → 16px
- Form gap: 12px

---

## 📝 Tipografia Responsiva

### Títulos (h1)

| Breakpoint | Desktop | Tablet | Mobile | Pequeno |
|------------|---------|--------|--------|---------|
| Tamanho    | 32px    | 28px   | 24px   | 20px    |
| Variável   | 4xl     | 3xl    | 2xl    | xl      |

### Subtítulos

| Breakpoint | Desktop | Tablet | Mobile |
|------------|---------|--------|--------|
| Tamanho    | 16px    | 16px   | 14px   |
| Variável   | base    | base   | sm     |

### Texto Corpo

| Breakpoint | Desktop | Tablet | Mobile |
|------------|---------|--------|--------|
| Tamanho    | 16px    | 16px   | 14px   |
| Variável   | base    | base   | sm     |

### Texto Pequeno

| Breakpoint | Desktop | Tablet | Mobile |
|------------|---------|--------|--------|
| Tamanho    | 14px    | 14px   | 12px   |
| Variável   | sm      | sm     | xs     |

---

## 🎨 Layout Adaptativo

### Form Cards

**Desktop:**
```
┌─────────────────────────────────┐
│  Background Gradient (Full)     │
│                                 │
│     ┌───────────────┐           │
│     │   Card 440px  │           │
│     │               │           │
│     │   Centered    │           │
│     │               │           │
│     └───────────────┘           │
│                                 │
└─────────────────────────────────┘
```

**Mobile:**
```
┌───────────────────┐
│  BG Gradient      │
│ ┌───────────────┐ │
│ │  Card 100%    │ │
│ │               │ │
│ │  Edge to Edge │ │
│ │  (8px margin) │ │
│ │               │ │
│ └───────────────┘ │
└───────────────────┘
```

### Profile Layout

**Desktop:**
```
┌─────────────────────────────────┐
│           [Name]        [Logout]│
│                                 │
│  NOME: João Silva               │
│  EMAIL: joao@email.com          │
│                                 │
│  ┌───────────────────────────┐ │
│  │    Sua Pontuação          │ │
│  │         42                │ │
│  └───────────────────────────┘ │
│                                 │
│  [Input──────────] [Copy Link] │
└─────────────────────────────────┘
```

**Mobile:**
```
┌───────────────────┐
│ [Name]            │
│ [Logout - Full]   │
│                   │
│ NOME: João Silva  │
│ EMAIL: joao@...   │
│                   │
│ ┌───────────────┐ │
│ │   Score: 42   │ │
│ └───────────────┘ │
│                   │
│ [Input────────]   │
│ [Copy - Full]     │
└───────────────────┘
```

---

## 🔄 Orientação (Landscape)

### Problema
Em landscape mobile, o teclado virtual pode ocupar 50% da tela.

### Solução
```css
@media (max-width: 768px) and (orientation: landscape) {
  .form-container {
    align-items: flex-start;
    padding-top: 20px;
  }
  
  .form-card {
    margin: 12px auto;
  }
}
```

**Resultado:**
- Form alinhado ao topo
- Scroll habilitado
- Padding reduzido

---

## 📱 Testes de Dispositivos

### Testado em:

#### Mobile
- ✅ iPhone 14 Pro (393 x 852)
- ✅ iPhone SE (375 x 667)
- ✅ Samsung Galaxy S21 (360 x 800)
- ✅ Pixel 5 (393 x 851)

#### Tablet
- ✅ iPad Air (820 x 1180)
- ✅ iPad Mini (768 x 1024)

#### Desktop
- ✅ 1920x1080
- ✅ 1366x768
- ✅ 1280x720

---

## ✅ Checklist de Responsividade

### Geral
- [x] Touch targets ≥ 44px
- [x] Texto legível sem zoom
- [x] Sem scroll horizontal
- [x] Imagens responsivas
- [x] Breakpoints consistentes

### Formulários
- [x] Inputs com altura adequada
- [x] Labels visíveis
- [x] Validações legíveis
- [x] Botões full-width em mobile
- [x] Teclado não quebra layout

### Navegação
- [x] Links clicáveis
- [x] Espaçamento adequado
- [x] Feedback visual claro

### Performance
- [x] Animações suaves
- [x] Sem jank em scroll
- [x] Transições otimizadas

---

## 🎨 Estratégia Mobile-First

Embora o código use desktop-first (por simplicidade), a estratégia de design considera mobile primeiro:

1. **Conteúdo Essencial**: O que é crítico?
2. **Hierarquia Visual**: O que ver primeiro?
3. **Touch Targets**: Fácil de clicar?
4. **Performance**: Rápido em 3G?

---

## 📊 Estatísticas de Uso

### Breakpoints Mais Comuns
- Mobile (≤480px): ~40%
- Tablet (481-768px): ~20%
- Desktop (>768px): ~40%

### Orientação
- Portrait: ~85%
- Landscape: ~15%

---

## 🔧 Ferramentas de Teste

### Chrome DevTools
```
F12 → Toggle Device Toolbar (Ctrl+Shift+M)
```

**Dispositivos Recomendados:**
- iPhone SE (375px)
- iPhone 12 Pro (390px)
- Pixel 5 (393px)
- iPad Air (820px)

### Firefox Responsive Design Mode
```
F12 → Responsive Design Mode (Ctrl+Shift+M)
```

### Safari
```
Develop → Enter Responsive Design Mode
```

---

## 🚀 Próximas Melhorias

- [ ] PWA para instalação mobile
- [ ] Gestos de swipe
- [ ] Notificações push
- [ ] Modo offline
- [ ] Dark mode
- [ ] Preferências de acessibilidade (tamanho de fonte)

---

## 📝 Exemplos de Código

### Breakpoint Padrão

```css
/* Desktop (padrão) */
.element {
  padding: 40px;
  font-size: 32px;
}

/* Tablet */
@media (max-width: 768px) {
  .element {
    padding: 30px;
    font-size: 28px;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .element {
    padding: 20px;
    font-size: 24px;
  }
}
```

### Touch Target

```css
.button {
  padding: 12px 24px;
}

@media (max-width: 480px) {
  .button {
    min-height: 44px;  /* Apple/Google guideline */
    width: 100%;        /* Full width no mobile */
    padding: 12px 16px;
  }
}
```

### Layout Adaptativo

```css
.container {
  display: flex;
  gap: 20px;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    gap: 12px;
  }
}
```
