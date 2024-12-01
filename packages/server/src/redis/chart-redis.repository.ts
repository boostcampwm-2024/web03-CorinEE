import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class ChartRedisRepository {
  constructor(
    @Inject('CHART_REDIS_CLIENT') private readonly chartRedis: Redis,
  ) {}

  async setChartData(key, value) {
    this.chartRedis.set(key, value);
  }

  async getChartDate(keys: string[]): Promise<any[]> {
    try {
      const promises = keys.map((key) => this.chartRedis.get(key));
      const results = await Promise.all(promises);
      return results.map((data) => (data ? JSON.parse(data) : null)).filter((data) => data !== null);
    } catch (error) {
      console.error('DB Searching Error:', error);
      throw error;
    }
  }

  async getSimpleChartData(key) {
    const data = await this.chartRedis.get(key);
    if (!data) {
      return false;
    } else return JSON.parse(data);
  }
}
