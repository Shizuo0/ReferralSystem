import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    increment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'senha123',
    };

    it('deve registrar um novo usuário com sucesso', async () => {
      mockUserRepository.findOne.mockResolvedValue(null); // Email não existe
      mockUserRepository.create.mockReturnValue({
        id: '1',
        ...registerDto,
        score: 0,
        referralCode: 'JOAO1234',
      });
      mockUserRepository.save.mockResolvedValue({
        id: '1',
        name: 'João Silva',
        email: 'joao@example.com',
        score: 0,
        referralCode: 'JOAO1234',
        createdAt: new Date(),
      });

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('user');
      expect(result.user.name).toBe('João Silva');
      expect(result.user.email).toBe('joao@example.com');
      expect(result.user.score).toBe(0);
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('deve lançar ConflictException se email já existe', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        id: '1',
        email: 'joao@example.com',
      });

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.register(registerDto)).rejects.toThrow(
        'Email já está cadastrado',
      );
    });

    it('deve lançar BadRequestException se código de indicação inválido', async () => {
      const registerWithInvalidRef: RegisterDto = {
        name: 'Outro Usuário',
        email: 'outro@example.com',
        password: 'senha123',
        referralCode: 'INVALID',
      };

      // Reset mocks para este teste
      jest.clearAllMocks();

      mockUserRepository.findOne
        .mockResolvedValueOnce(null) // Email não existe
        .mockResolvedValueOnce(null); // Código de indicação não existe

      await expect(service.register(registerWithInvalidRef)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve incrementar pontuação do referrer quando usar código válido', async () => {
      const referrer = {
        id: 'referrer-id',
        name: 'Maria',
        email: 'maria@example.com',
        referralCode: 'MARI5678',
        score: 5,
      };

      const registerWithRef: RegisterDto = {
        ...registerDto,
        email: 'novo@example.com',
        referralCode: 'MARI5678',
      };

      mockUserRepository.findOne
        .mockResolvedValueOnce(null) // Email não existe
        .mockResolvedValueOnce(referrer) // Código de indicação existe
        .mockResolvedValue(null); // Para geração de código único

      mockUserRepository.create.mockReturnValue({
        id: '2',
        name: 'João Silva',
        email: 'novo@example.com',
        referredById: 'referrer-id',
        score: 0,
      });

      mockUserRepository.save.mockResolvedValue({
        id: '2',
        name: 'João Silva',
        email: 'novo@example.com',
        score: 0,
        referralCode: 'JOAO1234',
        createdAt: new Date(),
      });

      await service.register(registerWithRef);

      // Verificar se incrementou a pontuação do referrer
      expect(mockUserRepository.increment).toHaveBeenCalledWith(
        { id: 'referrer-id' },
        'score',
        1,
      );
    });

    it('não deve incrementar pontuação se não houver código de indicação', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue({
        id: '1',
        ...registerDto,
        score: 0,
      });
      mockUserRepository.save.mockResolvedValue({
        id: '1',
        name: 'João Silva',
        email: 'joao@example.com',
        score: 0,
        referralCode: 'JOAO1234',
        createdAt: new Date(),
      });

      await service.register(registerDto);

      expect(mockUserRepository.increment).not.toHaveBeenCalled();
    });
  });
});
