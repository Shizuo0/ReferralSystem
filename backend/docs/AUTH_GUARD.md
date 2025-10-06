# Auth Guard - Proteção de Rotas

## Visão Geral

O `JwtAuthGuard` protege automaticamente **todas as rotas** da aplicação, exigindo um token JWT válido no header `Authorization`.

## Como funciona

### 1. Guard Global

O guard é registrado globalmente no `AppModule`:

```typescript
providers: [
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  }
]
```

**Isso significa:**
- ✅ Todas as rotas são protegidas por padrão
- ✅ Não precisa adicionar `@UseGuards()` em cada rota
- ✅ Segurança "secure by default"

---

### 2. Rotas Públicas

Use o decorator `@Public()` para marcar rotas que não precisam de autenticação:

```typescript
import { Public } from './auth/decorators/public.decorator';

@Public()
@Get('public-data')
getPublicData() {
  return { message: 'Dados públicos' };
}
```

**Rotas públicas no sistema:**
- `GET /` - Hello World
- `POST /auth/register` - Registro de usuário
- `POST /auth/login` - Login

---

### 3. Rotas Protegidas

Qualquer rota sem `@Public()` é automaticamente protegida:

```typescript
@Get('user/profile')
getProfile() {
  // Requer token JWT válido
  return { ... };
}
```

---

### 4. Acessar Usuário Autenticado

Use o decorator `@CurrentUser()` para acessar os dados do usuário logado:

```typescript
import { CurrentUser } from './auth/decorators/current-user.decorator';
import type { JwtPayload } from './auth/interfaces/jwt-payload.interface';

@Get('profile')
getProfile(@CurrentUser() user: JwtPayload) {
  return {
    userId: user.sub,
    email: user.email,
  };
}
```

**O que está disponível em `user`:**
```typescript
{
  sub: string;      // ID do usuário
  email: string;    // Email do usuário
  iat: number;      // Issued at (timestamp)
  exp: number;      // Expiration (timestamp)
}
```

---

## Fluxo de Validação

```
1. Requisição chega → JwtAuthGuard intercepta
   ↓
2. Verifica se rota é @Public()
   ↓ não
3. Extrai token do header Authorization
   ↓
4. Valida token com JWT_SECRET
   ↓
5. Decodifica payload
   ↓
6. Injeta payload em request.user
   ↓
7. Controller pode usar @CurrentUser()
```

---

## Exemplos

### Exemplo 1: Rota Pública

```typescript
@Controller('public')
export class PublicController {
  @Public()
  @Get('stats')
  getPublicStats() {
    return { users: 1000, referrals: 5000 };
  }
}
```

**Uso:**
```bash
curl http://localhost:3000/public/stats
# Não precisa de token ✅
```

---

### Exemplo 2: Rota Protegida Simples

```typescript
@Controller('user')
export class UserController {
  @Get('dashboard')
  getDashboard() {
    // Automaticamente protegida
    return { message: 'Dashboard data' };
  }
}
```

**Uso:**
```bash
# Sem token - ERRO
curl http://localhost:3000/user/dashboard
# 401 Unauthorized ❌

# Com token - SUCESSO
curl http://localhost:3000/user/dashboard \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
# 200 OK ✅
```

---

### Exemplo 3: Usando Dados do Usuário

```typescript
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: JwtPayload) {
    // Buscar dados completos do usuário usando o ID
    const fullUser = await this.userService.findById(user.sub);
    return fullUser;
  }

  @Post('update-name')
  async updateName(
    @CurrentUser() user: JwtPayload,
    @Body() body: { name: string }
  ) {
    // Atualizar apenas o próprio usuário
    return this.userService.updateName(user.sub, body.name);
  }
}
```

---

### Exemplo 4: Controller Público e Protegido

```typescript
@Controller('posts')
export class PostsController {
  // Rota pública - qualquer um pode ver posts
  @Public()
  @Get()
  getAllPosts() {
    return this.postsService.findAll();
  }

  // Rota protegida - apenas autenticados podem criar
  @Post()
  createPost(
    @CurrentUser() user: JwtPayload,
    @Body() createPostDto: CreatePostDto
  ) {
    return this.postsService.create(user.sub, createPostDto);
  }

  // Rota protegida - apenas o autor pode deletar
  @Delete(':id')
  async deletePost(
    @CurrentUser() user: JwtPayload,
    @Param('id') postId: string
  ) {
    const post = await this.postsService.findById(postId);
    
    if (post.authorId !== user.sub) {
      throw new ForbiddenException('Você não pode deletar este post');
    }
    
    return this.postsService.delete(postId);
  }
}
```

---

## Tratamento de Erros

### Token Ausente

**Request:**
```bash
curl http://localhost:3000/protected
```

**Response:**
```json
{
  "statusCode": 401,
  "message": "Token não fornecido"
}
```

---

### Token Inválido

**Request:**
```bash
curl http://localhost:3000/protected \
  -H "Authorization: Bearer token-invalido"
```

**Response:**
```json
{
  "statusCode": 401,
  "message": "Token inválido ou expirado"
}
```

---

### Token Expirado

**Request:**
```bash
curl http://localhost:3000/protected \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "statusCode": 401,
  "message": "Token inválido ou expirado"
}
```

**Solução:** Fazer login novamente para obter novo token.

---

## Boas Práticas

### ✅ DO

1. **Sempre use `@Public()` explicitamente** para rotas públicas:
   ```typescript
   @Public()
   @Get('public')
   ```

2. **Use `@CurrentUser()` para acessar dados do usuário**:
   ```typescript
   getProfile(@CurrentUser() user: JwtPayload)
   ```

3. **Valide permissões no controller**:
   ```typescript
   if (resource.ownerId !== user.sub) {
     throw new ForbiddenException();
   }
   ```

4. **Use `import type` para JwtPayload em decorators**:
   ```typescript
   import type { JwtPayload } from './auth/interfaces/jwt-payload.interface';
   ```

### ❌ DON'T

1. **Não remova o guard global**:
   ```typescript
   // ❌ Nunca faça isso
   // Remove a proteção de todas as rotas
   ```

2. **Não armazene dados sensíveis no JWT**:
   ```typescript
   // ❌ Não coloque senha no token
   payload = { sub: userId, password: userPassword }
   ```

3. **Não confie apenas no token sem validações adicionais**:
   ```typescript
   // ❌ Perigoso - qualquer usuário autenticado pode deletar
   @Delete(':id')
   delete(@Param('id') id: string) {
     return this.service.delete(id);
   }
   
   // ✅ Correto - valida propriedade
   @Delete(':id')
   delete(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
     // Validar se usuário é dono do recurso
   }
   ```

---

## Implementação Técnica

### JwtAuthGuard

```typescript
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Verificar se rota é pública
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    // 2. Extrair token
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token não fornecido');
    }

    // 3. Validar e decodificar
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // 4. Injetar usuário
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
```

---

## Próximos Passos

- [ ] Implementar roles/permissions (RBAC)
- [ ] Adicionar rate limiting por usuário
- [ ] Implementar refresh tokens
- [ ] Blacklist de tokens (logout)
- [ ] Auditoria de acessos
