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
  
    // 1. 데이터베이스에서 모든 게스트 유저 가져오기
    const guestUsers = await this.userRepository.find({ where: { isGuest: true } });
  
    for (const user of guestUsers) {
      try {
        // 2. Redis에서 해당 유저 키 확인
        const redisKey = `guest:${user.id}`;
        const redisData = await this.redisRepository.getAuthData(redisKey);
  
        if (!redisData) {
          // Redis에 데이터가 없으면 유저 삭제
          await this.userRepository.delete({ id: user.id });
          this.logger.log(`Deleted guest user from DB with ID: ${user.id}`);
        }
      } catch (error) {
        this.logger.error(`Error cleaning up guest user with ID: ${user.id}`, error.stack);
      }
    }
  
    this.logger.log('Expired guest cleanup finished.');
  }
  

  @Cron('0 */30 * * * *') // 30분 마다 실행
  async handleCron(): Promise<void> {
    this.logger.log('Running scheduled guest cleanup...');
    await this.cleanupExpiredGuests();
  }
}
