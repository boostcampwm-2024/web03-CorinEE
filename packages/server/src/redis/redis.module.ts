import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import { redisConfig } from 'src/configs/redis.config';
import { RedisRepository } from './redis.repository';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const client = new Redis(redisConfig);
        client.on('connect', () => console.log('Redis 연결 성공'));
        client.on('error', (error) => console.error('Redis 연결 실패:', error));
        return client;
      },
    },
    RedisRepository
  ],
  exports: ['REDIS_CLIENT', RedisRepository],
})
export class RedisModule {}