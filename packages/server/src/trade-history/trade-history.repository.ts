import { DataSource, Repository, QueryRunner } from 'typeorm';
import { TradeHistory } from './trade-history.entity';
import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/auth/user.repository';

@Injectable()
export class TradeHistoryRepository extends Repository<TradeHistory> {
  constructor(
    private dataSource: DataSource,
  ) {
    super(TradeHistory, dataSource.createEntityManager());
  }
  async createTradeHistory(user, trade: any, queryRunner: QueryRunner) {
    try {
      const tradeHistory = new TradeHistory();
      tradeHistory.tradeType = trade.tradeType;
      tradeHistory.assetName = trade.assetName;
      tradeHistory.price = trade.price;
      tradeHistory.quantity = trade.quantity;
      tradeHistory.user = user;
      tradeHistory.tradeCurrency = trade.tradeCurrency;
      tradeHistory.createdAt = trade.createdAt;

      await queryRunner.manager.save(TradeHistory, tradeHistory);
    } catch (e) {
      console.log(e);
    }
  }
}
