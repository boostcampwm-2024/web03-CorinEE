import { Module } from '@nestjs/common';
import { CleanupService } from './clean-up.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Account } from 'src/account/account.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User, Account])],
  providers: [CleanupService],
})
export class ScheduleModule {}
