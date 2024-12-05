import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { UserNotFoundException } from './exceptions/user.exceptions';

@Injectable()
export class UserRepository extends Repository<User> {
  private readonly logger = new Logger(UserRepository.name);
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async getUser(userId: number): Promise<User> {
    try {
      const user = await this.findOne({
        where: { id: userId },
      });

      if (!user) {
        this.logger.warn('User not found', { userId });
        throw new UserNotFoundException(userId);
      }

      return user;
    } catch (error) {
      if (!(error instanceof UserNotFoundException)) {
        this.logger.error('Failed to fetch user', {
          userId,
          error: error.stack,
        });
      }
      throw error;
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
