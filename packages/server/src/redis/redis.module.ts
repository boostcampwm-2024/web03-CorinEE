import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import { getRedisConfig } from 'src/configs/redis.config';
import { RedisRepository } from './redis.repository';
import { RedisController } from './redis.controller';
import { config } from 'dotenv';
config()
@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const client = new Redis(getRedisConfig());
        client.on('connect', () => console.log('Redis 연결 성공'));
        client.on('error', (error) => console.error('Redis 연결 실패:', error));
        return client;
      },
    },
    RedisRepository
  ],
  exports: ['REDIS_CLIENT', RedisRepository],
  controllers: [RedisController],
})
export class RedisModule {}