import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser um texto' })
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  @MaxLength(100, { message: 'Nome muito longo (máximo 100 caracteres)' })
  @Matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, {
    message: 'Nome contém caracteres inválidos',
  })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsEmail({}, { message: 'Email deve ser válido' })
  @MaxLength(255, { message: 'Email muito longo (máximo 255 caracteres)' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @MaxLength(72, { message: 'Senha muito longa (máximo 72 caracteres)' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
    message: 'Senha deve conter letras e números',
  })
  @Matches(/^\S+$/, {
    message: 'Senha não pode conter apenas espaços',
  })
  password: string;

  @IsOptional()
  @IsString({ message: 'Código de indicação deve ser um texto' })
  @Transform(({ value }) => value?.trim().toUpperCase())
  referralCode?: string; // Código de indicação (opcional)
}
