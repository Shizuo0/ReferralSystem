import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  // Validar variáveis de ambiente obrigatórias
  const requiredEnvVars = ['JWT_SECRET'];
  const missingEnvVars = requiredEnvVars.filter(
    (varName) => !process.env[varName],
  );

  if (missingEnvVars.length > 0) {
    logger.error(
      `❌ Variáveis de ambiente faltando: ${missingEnvVars.join(', ')}`,
    );
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule);

  // Filtro global de exceções
  app.useGlobalFilters(new HttpExceptionFilter());

  // Habilitar validação global com class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não definidas no DTO
      forbidNonWhitelisted: true, // Retorna erro se propriedades extras forem enviadas
      transform: true, // Transforma tipos automaticamente
      transformOptions: {
        enableImplicitConversion: false, // Não fazer conversões automáticas perigosas
      },
    }),
  );

  // Habilitar CORS para o frontend
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  
  logger.log(`🚀 Aplicação rodando em http://localhost:${port}`);
  logger.log(`🌐 Frontend permitido: ${frontendUrl}`);
}

bootstrap().catch((error) => {
  console.error('❌ Erro ao iniciar aplicação:', error);
  process.exit(1);
});
