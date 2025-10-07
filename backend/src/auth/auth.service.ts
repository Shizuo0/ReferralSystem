import {
  Injectable,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
  Logger,
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
import type { JwtPayload } from './interfaces/jwt-payload.interface';


@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    const { name, email, password, referralCode } = registerDto;
    this.logger.log(`Tentativa de registro: ${email}`);

    // Verificar se o email já está cadastrado
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      this.logger.warn(`Registro falhou: Email já cadastrado - ${email}`);
      throw new ConflictException('Email já está cadastrado');
    }

    // Verificar se o código de indicação existe (se fornecido)
    let referrer: User | null = null;
    if (referralCode) {
      referrer = await this.userRepository.findOne({
        where: { referralCode },
      });

      if (!referrer) {
        this.logger.warn(`Código de indicação inválido: ${referralCode}`);
        throw new BadRequestException('Código de indicação inválido');
      }
      this.logger.log(`Indicação válida: ${referralCode} (referrer: ${referrer.email})`);
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
    this.logger.log(`Usuário registrado com sucesso: ${savedUser.email} (ID: ${savedUser.id})`);

    // Incrementar pontuação do usuário que indicou
    if (referrer) {
      await this.incrementReferrerScore(referrer.id);
      this.logger.log(`Pontuação incrementada para ${referrer.email}`);
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

   // Gerar JWT token
    const accessToken = await this.generateToken(savedUser);
    this.logger.log(`Token JWT gerado para ${savedUser.email}`);

    return {
      message: 'Usuário registrado com sucesso',
      user: userResponse,
      accessToken,
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
        this.logger.debug(`Código de indicação gerado (nome): ${code}`);
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
        this.logger.debug(`Código de indicação gerado (aleatório): ${code}`);
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

    this.logger.log(`Tentativa de login: ${email}`);

    // Buscar usuário pelo email
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      this.logger.warn(`Login falhou: Usuário não encontrado - ${email}`);
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    // Verificar senha
    const isPasswordValid = await HashUtil.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      this.logger.warn(`Login falhou: Senha inválida - ${email}`);
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    this.logger.log(`Login bem-sucedido: ${user.email}`);

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
    this.logger.log(`Token JWT gerado para ${user.email}`);

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

    try {
      const token = await this.jwtService.signAsync(payload);
      this.logger.debug(`Token gerado com sucesso para user ${user.id}`);
      return token;
    } catch (error) {
      this.logger.error(`Erro ao gerar token para ${user.email}:`, error);
      throw new InternalServerErrorException('Erro ao gerar token de autenticação');
    }
  }
}
