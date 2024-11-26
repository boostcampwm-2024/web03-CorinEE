import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { AccountRepository } from 'src/account/account.repository';
import { UserNotFoundException } from './exceptions/user.exceptions';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    private dataSource: DataSource,
    private accountRepository: AccountRepository,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    super(User, dataSource.createEntityManager());
  }

  async getUser(userId: number): Promise<User> {
    try {
      const user = await this.findOne({
        where: { id: userId },
      });

      return user;
    } catch (error) {
      this.logger.error('유저 조회 실패', { error: error.stack, userId });
    }
  }
  async validateUser(userId: number): Promise<User> {
    const user = await this.getUser(userId);

    if (!user) {
      throw new UserNotFoundException(userId);
    }

    return user;
  }
}
