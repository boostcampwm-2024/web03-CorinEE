import { Module } from '@nestjs/common';
import { CleanupService } from './clean-up.service';
import { UserRepository } from 'src/auth/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Account } from 'src/account/account.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([User, Account]), // User와 Account를 TypeORM으로 등록
  ],
  providers: [CleanupService],
})
export class ScheduleModule {}
