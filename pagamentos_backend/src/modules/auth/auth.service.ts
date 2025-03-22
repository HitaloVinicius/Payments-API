import { Injectable, Logger, UnauthorizedException, CanActivate, ExecutionContext } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { PasswordUtil } from '../../utils/password.util'
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) { }

  async signIn(data: SignInDto): Promise<any> {
    const user = await this.prisma.users.findUnique({
      where: { email: data.email }
    })
    if (!user) {
      this.logger.error('UnauthorizedException -- Usuário não encontrado.')
      throw new UnauthorizedException('Usuário não encontrado.')
    }
    if (!await PasswordUtil.comparePassword(data.password, user.password)) {
      this.logger.error('UnauthorizedException -- Password incorreto.')
      throw new UnauthorizedException('Password incorreto.');
    }
    const payload = { id: user.id };
    const accessToken = await this.jwtService.signAsync(payload)

    this.logger.log('signIn -- Success')
    return { accessToken };
  }
}