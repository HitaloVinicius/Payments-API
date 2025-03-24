import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import { SignInDto } from './dto/sign-in.dto';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

describe('AuthService', () => {
  let authGuard: AuthGuard
  let jwtService: any

  const mockJwtService = {
    verifyAsync: jest.fn().mockRejectedValue(false)
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGuard,
        {
          provide: JwtService,
          useValue: mockJwtService
        }],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });


  it('should be return Unauthorized Exception without token', async () => {
    const context: ExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {}
        })
      }),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    }
    const result = authGuard.canActivate(context)
    await expect(result).rejects.toThrow(UnauthorizedException)
  })

  it('should be return Unauthorized Exception with invalid token without Bearer', async () => {
    const context: ExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            authorization: 'invalid-token'
          }
        })
      }),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    }
    const result = authGuard.canActivate(context)
    await expect(result).rejects.toThrow(UnauthorizedException)
  })

  it('should be return Unauthorized Exception with invalid token with Bearer', async () => {
    const context: ExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            authorization: 'Bearer invalid-token'
          }
        })
      }),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    }
    const result = authGuard.canActivate(context)
    await expect(result).rejects.toThrow(UnauthorizedException)
  })

  it('should be return true with valid token', async () => {
    jwtService.verifyAsync.mockResolvedValueOnce({ user: { id: '123' } })

    const context: ExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            authorization: 'Bearer mock-valid-token'
          }
        })
      }),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    }
    const result = await authGuard.canActivate(context)
    expect(result).toEqual(true)
  })
});