import { DataSource, Repository } from 'typeorm';
import { Account } from './account.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountRepository extends Repository<Account> {
  constructor(private dataSource: DataSource) {
    super(Account, dataSource.createEntityManager());
  }
}
