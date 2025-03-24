import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { BalanceModule } from './modules/balance/balance.module';

@Module({
  imports: [UserModule, DatabaseModule, AuthModule, BalanceModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
