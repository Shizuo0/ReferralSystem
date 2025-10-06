import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Busca perfil do usuário por ID
   * Retorna dados públicos (sem senha)
   */
  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Retornar dados sem a senha
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      score: user.score,
      referralCode: user.referralCode,
      createdAt: user.createdAt,
    };
  }

  /**
   * Busca usuário por ID (para uso interno)
   */
  async findById(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
    });
  }
}
