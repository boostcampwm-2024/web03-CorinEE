import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisRepository {
	constructor(
		@Inject('TRADE_REDIS_CLIENT') private readonly tradeRedis: Redis,
		@Inject('AUTH_REDIS_CLIENT') private readonly authRedis: Redis,
	) {}

	async setTradeData(
		key: string,
		value: string,
		ttl?: number,
	): Promise<string> {
		if (ttl) {
			return this.tradeRedis.set(key, value, 'EX', ttl);
		}
		return this.tradeRedis.set(key, value);
	}

	async getTradeData(key: string): Promise<string | null> {
		return this.tradeRedis.get(key);
	}

	async setAuthData(key: string, value: string, ttl?: number): Promise<string> {
		if (ttl) {
			return this.authRedis.set(key, value, 'EX', ttl);
		}
		return this.authRedis.set(key, value);
	}

	async getAuthData(key: string): Promise<string | null> {
		return this.authRedis.get(key);
	}

	async getAuthDataKeys(pattern: string): Promise<string[]> {
		return this.authRedis.keys(pattern);
	}

	async deleteAuthData(key: string): Promise<number> {
		return this.authRedis.del(key);
	}
}
