import { Module } from '@nestjs/common';
import { TradeController } from './trade.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trade } from './trade.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { TradeService } from './trade.service';
import { TradeRepository } from './trade.repository';
import { AccountRepository } from 'src/account/account.repository';

@Module({
	imports: [TypeOrmModule.forFeature([Trade])],
	providers: [
		TradeService,
		TradeRepository,
		AccountRepository,
	],
	controllers: [TradeController],
})
export class TradeModule {}
