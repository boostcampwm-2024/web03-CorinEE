import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import { getRedisConfig } from 'src/configs/redis.config';
import { TradeRedisRepository } from './trade-redis.repository';
import { AuthRedisRepository } from './auth-redis.repository';
import { ChartRedisRepository } from './chart-redis.repository';

@Global()
@Module({
  providers: [
    {
      provide: 'TRADE_REDIS_CLIENT',
      useFactory: () => {
        const config = getRedisConfig();
        const client = new Redis({ ...config, db: 1 });
        client.on('connect', () => console.log('트레이드용 Redis 연결 성공'));
        client.on('error', (error) =>
          console.error('트레이드용 Redis 연결 실패:', error),
        );
        return client;
      },
    },
    {
      provide: 'AUTH_REDIS_CLIENT',
      useFactory: () => {
        const config = getRedisConfig();
        const client = new Redis({ ...config, db: 2 });
        client.on('connect', () => console.log('Auth용 Redis 연결 성공'));
        client.on('error', (error) =>
          console.error('Auth용 Redis 연결 실패:', error),
        );
        return client;
      },
    },
    {
      provide: 'CHART_REDIS_CLIENT',
      useFactory: () => {
        const config = getRedisConfig();
        const client = new Redis({ ...config, db: 3 });
        client.on('connect', () => console.log('Chart용 Redis 연결 성공'));
        client.on('error', (error) =>
          console.error('Chart용 Redis 연결 실패:', error),
        );
        return client;
      },
    },
    TradeRedisRepository,
    AuthRedisRepository,
    ChartRedisRepository,
  ],
  exports: [
    'TRADE_REDIS_CLIENT',
    'AUTH_REDIS_CLIENT',
    'CHART_REDIS_CLIENT',
    TradeRedisRepository,
    AuthRedisRepository,
    ChartRedisRepository,
  ],
})
export class RedisModule {}
