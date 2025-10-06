import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { RegisterResponseDto, AuthResponseDto } from './dto/auth-response.dto';
import { HashUtil } from '../common/utils/hash.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    const { name, email, password, referralCode } = registerDto;

    // Verificar se o email já está cadastrado
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email já está cadastrado');
    }

    // Verificar se o código de indicação existe (se fornecido)
    let referrer: User | null = null;
    if (referralCode) {
      referrer = await this.userRepository.findOne({
        where: { referralCode },
      });

      if (!referrer) {
        throw new BadRequestException('Código de indicação inválido');
      }
    }

    // Hash da senha antes de salvar
    const hashedPassword = await HashUtil.hashPassword(password);

    // Criar novo usuário
    const newUser = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      referralCode: 'TEMP', // TODO: Geração será implementada no commit 4
      referredById: referrer?.id || null,
      score: 0,
    });

    const savedUser = await this.userRepository.save(newUser);

    // TODO: Incrementar pontuação do referrer (commit 5)

    // Retornar dados do usuário (sem a senha)
    const userResponse: AuthResponseDto = {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      score: savedUser.score,
      referralCode: savedUser.referralCode,
      createdAt: savedUser.createdAt,
    };

    return {
      message: 'Usuário registrado com sucesso',
      user: userResponse,
    };
  }
}
