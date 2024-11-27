import { DataSource, Repository, QueryRunner } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '@src/auth/user.entity';
import { TradeHistory } from './trade-history.entity';
import { CreateTradeHistoryDto } from './dtos/trade-history.dto';

@Injectable()
export class TradeHistoryRepository extends Repository<TradeHistory> {
  private readonly logger = new Logger(TradeHistoryRepository.name);

  constructor(private readonly dataSource: DataSource) {
    super(TradeHistory, dataSource.createEntityManager());
  }

  async createTradeHistory(
    user: User,
    tradeData: CreateTradeHistoryDto,
    queryRunner: QueryRunner,
  ): Promise<void> {
    this.logger.log(`거래 내역 생성 시작: userId=${user.id}`);

    try {
      const tradeHistory = new TradeHistory();
      Object.assign(tradeHistory, {
        ...tradeData,
        user,
      });

      await queryRunner.manager.save(TradeHistory, tradeHistory);
      this.logger.log(`거래 내역 생성 완료: userId=${user.id}`);
    } catch (error) {
      this.logger.error(`거래 내역 생성 실패: ${error.message}`, error.stack);
      throw error;
    }
  }
}
