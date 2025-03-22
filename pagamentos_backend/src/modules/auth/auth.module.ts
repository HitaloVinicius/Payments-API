import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule, JwtModule.register({
    secret: process.env.JWT_SECRET
  })],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
