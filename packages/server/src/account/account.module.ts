import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { AccountRepository } from './account.repository';
import { User } from 'src/auth/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Account, User])],
  providers: [AccountRepository],
})
export class AccountModule {}
