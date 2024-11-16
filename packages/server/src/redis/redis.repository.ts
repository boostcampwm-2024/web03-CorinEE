import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisRepository {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis, // DI로 Redis 클라이언트 주입
  ) {}

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<string> {
    if (ttl) {
      return this.redisClient.set(key, value, 'EX', ttl); // TTL이 있는 경우
    }
    return this.redisClient.set(key, value); // TTL이 없는 경우
  }

  async delete(key: string): Promise<number> {
    return this.redisClient.del(key);
  }

  async exists(key: string): Promise<number> {
    return this.redisClient.exists(key);
  }
}
