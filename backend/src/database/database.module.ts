import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';

/**
 * Módulo centralizado de configuração do banco de dados
 * 
 * Configuração SQLite:
 * - Database: database/referral-system.db
 * - Synchronize: true (apenas desenvolvimento)
 * - Logging: true (para debug)
 */
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database/referral-system.db',
      entities: [User],
      synchronize: true,
      logging: true,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
