import { Module, forwardRef } from '@nestjs/common';
import { TradeController } from './trade.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trade } from './trade.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { TradeService } from './trade.service';
import { TradeRepository } from './trade.repository';
import { AccountRepository } from 'src/account/account.repository';
import { AssetRepository } from 'src/asset/asset.repository';
import { UserRepository } from 'src/auth/user.repository';
import { CoinDataUpdaterService } from 'src/upbit/coin-data-updater.service';
import { HttpModule } from '@nestjs/axios';
import { UpbitModule } from 'src/upbit/upbit.module';
import { TradeHistoryRepository } from 'src/trade-history/trade-history.repository';

@Module({
	imports: [
		TypeOrmModule.forFeature([Trade]),
		HttpModule,
		UpbitModule
	],
	providers: [
		TradeService,
		TradeRepository,
		AccountRepository,
		AssetRepository,
		UserRepository,
		TradeHistoryRepository
	],
	controllers: [TradeController],
})
export class TradeModule {}
