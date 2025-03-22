import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserController', () => {
  let userController: UserController;

  const mockUserService = {
    create: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  it('should create a user', async () => {
    const userDto: CreateUserDto = {
      name: 'Stuart Bloom',
      email: 'stuart.bloom@incentive.me',
      password: 'password2'
    };
    await userController.create(userDto);

    expect(mockUserService.create).toHaveBeenCalledTimes(1);
    expect(mockUserService.create).toHaveBeenCalledWith(userDto);
  });
});
