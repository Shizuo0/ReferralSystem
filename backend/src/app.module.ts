import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database/referral-system.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Apenas para desenvolvimento - criar tabelas automaticamente
      logging: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
