import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UserRepository } from '../auth/user.repository';
import { RedisRepository } from '../redis/redis.repository';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(
    private readonly redisRepository: RedisRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async cleanupExpiredGuests(): Promise<void> {
    this.logger.log('Expired guest cleanup started.');

    const guestUsers = await this.userRepository.find({
      where: { isGuest: true },
    });

    for (const user of guestUsers) {
      try {
        const redisKey = `guest:${user.id}`;
        const redisData = await this.redisRepository.getAuthData(redisKey);

        if (!redisData) {
          await this.userRepository.delete({ id: user.id });
          this.logger.log(`Deleted guest user from DB with ID: ${user.id}`);
        }
      } catch (error) {
        this.logger.error(
          `Error cleaning up guest user with ID: ${user.id}`,
          error.stack,
        );
      }
    }

    this.logger.log('Expired guest cleanup finished.');
  }

  //@Cron('*/30 * * * *')
  @Cron('* * * * *')
  async handleCron(): Promise<void> {
    this.logger.log('Running scheduled guest cleanup...');
    await this.cleanupExpiredGuests();
  }
}
