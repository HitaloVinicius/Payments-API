import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import { SignInDto } from './dto/sign-in.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;

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
      findUnique: jest.fn().mockImplementation(({ where }) => mockDb.find((element) => (element.email === where.email))),
    }
  };

  const mockJwtService = {
    signAsync: jest.fn().mockReturnValue('eyJhbGciOiJIUzI1...')
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService
        }],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should be authenticate valid user', async () => {
    const data: SignInDto = {
      email: 'leonard.hofstadter@incentive.me',
      password: 'password1'
    }
    const result = await authService.signIn(data)
    expect(result).toEqual({
      accessToken: 'eyJhbGciOiJIUzI1...'
    })
  })

  it('should be not authenticate invalid user email', async () => {
    const data: SignInDto = {
      email: 'leonard.hofstadter2@incentive.me',
      password: 'password1'
    }
    const result = authService.signIn(data)
    await expect(result).rejects.toThrow(UnauthorizedException)
  })

  it('should be not authenticate invalid user password', async () => {
    const data: SignInDto = {
      email: 'leonard.hofstadter@incentive.me',
      password: 'password2'
    }
    const result = authService.signIn(data)
    await expect(result).rejects.toThrow(UnauthorizedException)
  })
});