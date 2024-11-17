import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisRepository {
  constructor(
    @Inject('TRADE_REDIS_CLIENT') private readonly tradeRedis: Redis, // 트레이드용 Redis
    @Inject('AUTH_REDIS_CLIENT') private readonly authRedis: Redis,   // Auth용 Redis
  ) {}

 // 트레이드용 Redis 작업
 async setTradeData(key: string, value: string, ttl?: number): Promise<string> {
  if (ttl) {
    return this.tradeRedis.set(key, value, 'EX', ttl);
  }
  return this.tradeRedis.set(key, value);
}

async getTradeData(key: string): Promise<string | null> {
  return this.tradeRedis.get(key);
}

// Auth용 Redis 작업
async setAuthData(key: string, value: string, ttl?: number): Promise<string> {
  if (ttl) {
    return this.authRedis.set(key, value, 'EX', ttl);
  }
  return this.authRedis.set(key, value);
}

async getAuthData(key: string): Promise<string | null> {
  return this.authRedis.get(key);
}
}
