import { DataSource, Repository } from 'typeorm';
import { TradeHistory } from './trade-history.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TradeHistoryRepository extends Repository<TradeHistory> {
  constructor(private dataSource: DataSource) {
    super(TradeHistory, dataSource.createEntityManager());
  }
}
