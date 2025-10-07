# Captura de Código de Indicação via URL

## Como Funciona

O sistema captura automaticamente o código de indicação quando presente na URL.

### Formato da URL

```
http://localhost:5173/register?ref=MARI1234
                                    └─── Código de indicação
```

### Implementação

#### 1. Extração do Parâmetro

```typescript
import { useSearchParams } from 'react-router-dom';

const [searchParams] = useSearchParams();
const referralCodeFromUrl = searchParams.get('ref');
```

**Exemplos:**
- URL: `http://localhost:5173/register?ref=MARI1234` → `referralCodeFromUrl = "MARI1234"`
- URL: `http://localhost:5173/register` → `referralCodeFromUrl = null`

#### 2. Feedback Visual

Quando há código na URL, exibe mensagem:

```typescript
useEffect(() => {
  if (referralCodeFromUrl) {
    setReferralInfo(`Você foi indicado por alguém! Código: ${referralCodeFromUrl}`);
  }
}, [referralCodeFromUrl]);
```

**Visual:**
```
┌─────────────────────────────────────┐
│ 🎉 Você foi indicado por alguém!    │
│    Código: MARI1234                 │
└─────────────────────────────────────┘
```

#### 3. Envio para API

O código é automaticamente incluído no registro:

```typescript
await ApiService.register({
  name: formData.name,
  email: formData.email,
  password: formData.password,
  referralCode: referralCodeFromUrl || undefined,  // ← Código da URL
});
```

---

## Fluxo Completo

### Cenário: Maria indica João

#### 1. Maria obtém seu link

Maria acessa seu perfil e copia o link:
```
http://localhost:5173/register?ref=MARI5678
```

#### 2. Maria compartilha

Via WhatsApp, email, redes sociais, etc.

#### 3. João clica no link

João abre a URL no navegador e vê:

```
┌───────────────────────────────────────────┐
│ Criar Conta                               │
│ Cadastre-se e comece a ganhar pontos      │
│                                           │
│ 🎉 Você foi indicado por alguém!          │
│    Código: MARI5678                       │
│                                           │
│ [Nome Completo: ____________________]     │
│ [Email: ____________________________]     │
│ [Senha: ____________________________]     │
│                                           │
│ [Criar Conta]                             │
└───────────────────────────────────────────┘
```

#### 4. João preenche e envia

Quando João submete o formulário, a requisição inclui:

```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "referralCode": "MARI5678"  ← Enviado automaticamente!
}
```

#### 5. Backend processa

- ✅ Cria conta de João
- ✅ Valida código `MARI5678`
- ✅ Incrementa +1 ponto para Maria
- ✅ Retorna sucesso

---

## Validações

### Código Válido

Se o código existe no banco:
- ✅ Usuário é criado
- ✅ Indicador ganha +1 ponto
- ✅ Relacionamento é criado

### Código Inválido

Se o código NÃO existe:
```json
{
  "statusCode": 400,
  "message": "Código de indicação inválido"
}
```

**Mensagem exibida:**
```
┌───────────────────────────────────────────┐
│ ⚠️ Código de indicação inválido            │
└───────────────────────────────────────────┘
```

### Sem Código

Se a URL não tem parâmetro `ref`:
- ✅ Usuário é criado normalmente
- ✅ Sem indicação registrada
- ✅ Score inicial = 0

---

## Exemplos de URLs

### Sem indicação
```
http://localhost:5173/register
```
→ Cadastro normal

### Com indicação
```
http://localhost:5173/register?ref=MARI1234
```
→ Maria ganha +1 ponto

### URL compartilhável completa

O backend retorna no perfil:
```json
{
  "referralLink": "http://localhost:5173/register?ref=MARI1234"
}
```

Usuário pode copiar e compartilhar diretamente!

---

## Implementação Técnica

### React Router v6

Usa `useSearchParams` do React Router:

```typescript
import { useSearchParams } from 'react-router-dom';

function Register() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('ref');
  
  // code = "MARI1234" se URL tem ?ref=MARI1234
  // code = null se não tem parâmetro
}
```

### Alternativas (sem React Router)

```typescript
// Opção 1: URLSearchParams nativo
const params = new URLSearchParams(window.location.search);
const code = params.get('ref');

// Opção 2: Regex
const match = window.location.search.match(/[?&]ref=([^&]+)/);
const code = match ? match[1] : null;
```

---

## Teste Manual

### 1. Sem código
```bash
# Abrir navegador
http://localhost:5173/register

# Resultado: Formulário normal (sem mensagem verde)
```

### 2. Com código válido
```bash
# Primeiro, criar um usuário
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Maria","email":"maria@test.com","password":"senha123"}'

# Copiar o referralCode da resposta (ex: MARI1234)

# Abrir navegador com código
http://localhost:5173/register?ref=MARI1234

# Resultado: Mensagem verde "🎉 Você foi indicado por alguém! Código: MARI1234"
```

### 3. Com código inválido
```bash
http://localhost:5173/register?ref=INVALIDO

# Preencher formulário e submeter
# Resultado: Erro "Código de indicação inválido"
```

---

## Comportamento Mobile

Em dispositivos móveis, a URL pode ser compartilhada via:
- WhatsApp
- Telegram
- Email
- SMS
- QR Code

O código é capturado automaticamente quando o link é aberto! 📱

---

## Próximos Passos

- [ ] Adicionar QR Code para compartilhamento
- [ ] Copiar link direto do perfil
- [ ] Preview do link antes de compartilhar
- [ ] Analytics de indicações (tracking)
