import { Module } from '@nestjs/common';
import { CleanupService } from './clean-up.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Account } from 'src/account/account.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TradeCleanupService } from './trade-clean-up.service';
import { TradeModule } from '@src/trade/trade.module';

@Module({
	imports: [AuthModule, TypeOrmModule.forFeature([User, Account]), TradeModule],
	providers: [CleanupService, TradeCleanupService],
})
export class ScheduleModule {}
