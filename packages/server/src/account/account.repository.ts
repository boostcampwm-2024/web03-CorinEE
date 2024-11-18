import { DataSource, Repository } from 'typeorm';
import { Account } from './account.entity';
import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/user.entity';

@Injectable()
export class AccountRepository extends Repository<Account> {
  constructor(private dataSource: DataSource) {
    super(Account, dataSource.createEntityManager());
  }
  async createAccountForAdmin(adminUser: User) {
    const account = new Account();
    account.KRW = 300000000;
    account.USDT = 300000;
    account.BTC = 10;
    account.user = adminUser;
    await this.save(account);
    console.log('admin 계정에 Account가 성공적으로 생성되었습니다.');
  }
  async getMyMoney(user, moneyType: string) {
    const account = await this.findOne({
      where: { user: { id: user.userId } },
    });

    if (!account[moneyType]) return 0;
    return account[moneyType];
  }
  async succesBuy(buyDto, accountBalance, accountId, queryRunner) {
    const updateData = {
      accountId: accountId,
      [buyDto.typeGiven]: accountBalance,
    };

    await queryRunner.manager.save(Account, updateData);
  }
}
