import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../../database/prisma.service';
import { PasswordUtil } from '../../utils/password.util';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)
  constructor(private prisma: PrismaService) { }

  async create(data: CreateUserDto) {
    const userExist = await this.prisma.users.findUnique({
      where: {
        email: data.email
      }
    })
    if (userExist) {
      this.logger.error('ConflictException -- E-mail já cadastrado')
      throw new ConflictException('E-mail já cadastrado')
    }
    const user = await this.prisma.users.create({
      data: {
        ...data,
        password: await PasswordUtil.hashPassword(data.password)
      }
    })

    this.logger.log('create -- Success')
    return {
      message: 'Usuário criado com sucesso!',
      userId: user.id,
    };
  }
}