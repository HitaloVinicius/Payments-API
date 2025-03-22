import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;

  const mockDb = [
    {
      id: '6752b1b0-2464-47d4-a0d3-c399141e5943',
      name: 'Leonard Hofstadter',
      email: 'leonard.hofstadter@incentive.me',
      password: '$2b$10$jRklZ/HcFDNxQyA5fRsiPeZE6Lp4AEOmOfz9.OmIhiXJr8MVwae6e'
    }
  ]

  const mockPrismaService = {
    users: {
      create: jest.fn().mockReturnValue({ id: 'd7d5f12f-b486-443f-856d-162819c3d133' }),
      findUnique: jest.fn().mockImplementation(({ where }) => mockDb.find((element) => (element.email === where.email))),
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, {
        provide: PrismaService,
        useValue: mockPrismaService
      }],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });


  describe('createUser', () => {
    it('should be create user with valid email', async () => {
      const data: CreateUserDto = {
        email: 'sheldon.cooper@incentive.me',
        name: 'Sheldon Cooper',
        password: 'password4'
      }
      const result = await userService.create(data)
      expect(result).toEqual({
        message: 'Usuário criado com sucesso!',
        userId: result.userId,
      })
    })

    it('should throw an error if email exists', async () => {
      const data: CreateUserDto = {
        email: 'leonard.hofstadter@incentive.me',
        name: 'Leonard Hofstadter',
        password: 'password5'
      }
      const result = userService.create(data)
      await expect(result).rejects.toThrow(ConflictException);
    });
  })
});
