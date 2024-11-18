import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import { getRedisConfig } from 'src/configs/redis.config';
import { RedisRepository } from './redis.repository';

@Global()
@Module({
  providers: [
    {
      provide: 'TRADE_REDIS_CLIENT', // 트레이드용 Redis 클라이언트
      useFactory: () => {
        const config = getRedisConfig();
        const client = new Redis({ ...config, db: 1 }); // DB 1로 설정
        client.on('connect', () => console.log('트레이드용 Redis 연결 성공'));
        client.on('error', (error) =>
          console.error('트레이드용 Redis 연결 실패:', error),
        );
        return client;
      },
    },
    {
      provide: 'AUTH_REDIS_CLIENT', // Auth용 Redis 클라이언트
      useFactory: () => {
        const config = getRedisConfig();
        const client = new Redis({ ...config, db: 2 }); // DB 2로 설정
        client.on('connect', () => console.log('Auth용 Redis 연결 성공'));
        client.on('error', (error) =>
          console.error('Auth용 Redis 연결 실패:', error),
        );
        return client;
      },
    },
    RedisRepository,
  ],
  exports: ['TRADE_REDIS_CLIENT', 'AUTH_REDIS_CLIENT', RedisRepository],
})
export class RedisModule {}
