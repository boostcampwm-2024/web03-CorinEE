import { DataSource, Repository } from 'typeorm';
import { Trade } from './trade.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TradeRepository extends Repository<Trade> {
  constructor(private dataSource: DataSource) {
    super(Trade, dataSource.createEntityManager());
  }
}
