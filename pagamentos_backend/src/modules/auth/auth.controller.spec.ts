import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

describe('AuthController', () => {
  let authController: AuthController;

  const mockAuthService = {
    signIn: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }]
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should auth user', async () => {
    const signInDto: SignInDto = {
      email: 'stuart.bloom@incentive.me',
      password: 'password2'
    };
    await authController.SignIn(signInDto);
    expect(mockAuthService.signIn).toHaveBeenCalledTimes(1);
  });
});