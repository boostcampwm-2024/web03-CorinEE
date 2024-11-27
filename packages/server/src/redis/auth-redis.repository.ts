import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class AuthRedisRepository {
  constructor(@Inject('AUTH_REDIS_CLIENT') private readonly authRedis: Redis) {}

  async setAuthData(key: string, value: string, ttl?: number): Promise<string> {
    if (ttl) {
      return this.authRedis.set(key, value, 'EX', ttl);
    }
    return this.authRedis.set(key, value);
  }

  async getAuthData(key: string): Promise<string | null> {
    return this.authRedis.get(key);
  }

  async deleteAuthData(key: string): Promise<number> {
    return this.authRedis.del(key);
  }

  async getAuthDataKeys(pattern: string): Promise<string[]> {
    const keys: string[] = [];
    let cursor = '0';

    do {
      const [nextCursor, matchedKeys] = await this.authRedis.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100,
      );
      cursor = nextCursor;
      keys.push(...matchedKeys);
    } while (cursor !== '0');

    return keys;
  }
}
