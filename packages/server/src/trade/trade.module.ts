import { Module } from '@nestjs/common';
import { TradeController } from './trade.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trade } from './trade.entity';
import { BidService } from './trade-bid.service';
import { TradeRepository } from './trade.repository';
import { AccountRepository } from 'src/account/account.repository';
import { AssetRepository } from 'src/asset/asset.repository';
import { UserRepository } from 'src/auth/user.repository';
import { HttpModule } from '@nestjs/axios';
import { UpbitModule } from 'src/upbit/upbit.module';
import { TradeHistoryRepository } from 'src/trade-history/trade-history.repository';
import { AskService } from './trade-ask.service';
import { TradeService } from './trade.service';

@Module({
  imports: [TypeOrmModule.forFeature([Trade]), HttpModule, UpbitModule],
  providers: [
    BidService,
    AskService,
    TradeRepository,
    AccountRepository,
    AssetRepository,
    UserRepository,
    TradeHistoryRepository,
    TradeService,
  ],
  controllers: [TradeController],
  exports: [TradeRepository]
})
export class TradeModule {}
