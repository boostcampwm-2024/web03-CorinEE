import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthService } from './auth.service';
import { AccountRepository } from 'src/account/account.repository';
import { AuthController } from './auth.controller';
import { AccountModule } from 'src/account/account.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '6000s' },
    }),
    AccountModule,
  ],
  providers: [UserRepository, AccountRepository, AuthService, JwtService],
  controllers: [AuthController],
  exports: [UserRepository],
})
export class AuthModule {}
