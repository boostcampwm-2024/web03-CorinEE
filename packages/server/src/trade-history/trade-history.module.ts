import { Module } from '@nestjs/common';
import { TradeHistoryRepository } from './trade-history.repository';
import { TradeHistory } from './trade-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoinDataUpdaterService } from '@src/upbit/coin-data-updater.service';
import { HttpModule } from '@nestjs/axios';
import { TradeHistoryController } from './trade-history.controller';
import { TradeHistoryService } from './trade-history.service';
import { UpbitModule } from '@src/upbit/upbit.module';

@Module({
    imports: [TypeOrmModule.forFeature([TradeHistory]), HttpModule, UpbitModule],
    providers: [
        TradeHistoryRepository,
        TradeHistoryService,
    ],
    controllers: [TradeHistoryController],
})
export class TradehistoryModule {}
