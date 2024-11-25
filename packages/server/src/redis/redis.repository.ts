import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisRepository {
  constructor(
    @Inject('TRADE_REDIS_CLIENT') private readonly tradeRedis: Redis,
    @Inject('AUTH_REDIS_CLIENT') private readonly authRedis: Redis,
    @Inject('CHART_REDIS_CLIENT') private readonly chartRedis: Redis,
  ) {}

  //trade
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

  //auth
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

  //chart
  async setChartData(key, value) {
    this.chartRedis.set(key, value);
  }
  async getChartDate(keys) {
    try {
      const results = await Promise.all(
        keys.map(async (key) => {
          try {
            const data = await this.chartRedis.get(key);
            if (!data) {
              return null;
            }
            return JSON.parse(data);
          } catch (error) {
            console.error(`Error fetching data for key ${key}:`, error);
            return null;
          }
        }),
      );
      return results.filter((data) => data !== null);
    } catch (error) {
      console.error('DB Searching Error : ' + error);
    }
  }
  async getSimpleChartData(key) {
    const data = await this.chartRedis.get(key);
    if (!data) {
      return false;
    } else return JSON.parse(data);
  }
}
