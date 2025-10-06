import {
  Injectable,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterResponseDto, AuthResponseDto } from './dto/auth-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { HashUtil } from '../common/utils/hash.util';
import { ReferralCodeUtil } from '../common/utils/referral-code.util';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
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

    // Gerar código de indicação único
    const uniqueReferralCode = await this.generateUniqueReferralCode(name);

    // Criar novo usuário
    const newUser = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      referralCode: uniqueReferralCode,
      referredById: referrer?.id || null,
      score: 0,
    });

    const savedUser = await this.userRepository.save(newUser);

    // Incrementar pontuação do usuário que indicou
    if (referrer) {
      await this.incrementReferrerScore(referrer.id);
    }

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

  /**
   * Gera um código de indicação único verificando no banco
   * Tenta primeiro com base no nome, depois códigos aleatórios se necessário
   */
  private async generateUniqueReferralCode(name: string): Promise<string> {
    const maxAttempts = 10;

    // Tentar com código baseado no nome
    for (let i = 0; i < maxAttempts; i++) {
      const code = ReferralCodeUtil.generateFromName(name);
      const existing = await this.userRepository.findOne({
        where: { referralCode: code },
      });

      if (!existing) {
        return code;
      }
    }

    // Se não conseguiu com nome, tentar código totalmente aleatório
    for (let i = 0; i < maxAttempts; i++) {
      const code = ReferralCodeUtil.generateCode();
      const existing = await this.userRepository.findOne({
        where: { referralCode: code },
      });

      if (!existing) {
        return code;
      }
    }

    // Improvável de acontecer, mas por segurança
    throw new InternalServerErrorException(
      'Não foi possível gerar um código de indicação único',
    );
  }

  /**
   * Incrementa a pontuação do usuário que fez a indicação
   * @param referrerId ID do usuário que indicou
   */
  private async incrementReferrerScore(referrerId: string): Promise<void> {
    await this.userRepository.increment({ id: referrerId }, 'score', 1);
  }

  /**
   * Realiza login do usuário
   * Valida credenciais e retorna dados do usuário
   */
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;

    // Buscar usuário pelo email
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    // Verificar senha
    const isPasswordValid = await HashUtil.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    // Retornar dados do usuário (sem a senha)
    const userResponse: AuthResponseDto = {
      id: user.id,
      name: user.name,
      email: user.email,
      score: user.score,
      referralCode: user.referralCode,
      createdAt: user.createdAt,
    };

    // Gerar JWT token
    const accessToken = await this.generateToken(user);

    return {
      message: 'Login realizado com sucesso',
      user: userResponse,
      accessToken,
    };
  }

  /**
   * Gera um JWT token para o usuário
   */
  private async generateToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    return this.jwtService.signAsync(payload);
  }
}
