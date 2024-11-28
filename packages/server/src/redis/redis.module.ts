import { Module, Global, Logger } from '@nestjs/common';
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
        const logger = new Logger('TRADE_REDIS_CLIENT');
        client.on('connect', () => logger.log('트레이드용 Redis 연결 성공'));
        client.on('error', (error) =>
          logger.error('트레이드용 Redis 연결 실패:', error),
        );
        return client;
      },
    },
    {
      provide: 'AUTH_REDIS_CLIENT',
      useFactory: () => {
        const config = getRedisConfig();
        const client = new Redis({ ...config, db: 2 });
        const logger = new Logger('AUTH_REDIS_CLIENT');
        client.on('connect', () => logger.log('Auth용 Redis 연결 성공'));
        client.on('error', (error) =>
          logger.error('Auth용 Redis 연결 실패:', error),
        );
        return client;
      },
    },
    {
      provide: 'CHART_REDIS_CLIENT',
      useFactory: () => {
        const config = getRedisConfig();
        const client = new Redis({ ...config, db: 3 });
        const logger = new Logger('CHART_REDIS_CLIENT');
        client.on('connect', () => logger.log('Chart용 Redis 연결 성공'));
        client.on('error', (error) =>
          logger.error('Chart용 Redis 연결 실패:', error),
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
