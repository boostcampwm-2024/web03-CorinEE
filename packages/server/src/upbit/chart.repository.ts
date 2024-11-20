import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class ChartRepository {
  constructor(
    @Inject('CHART_REDIS_CLIENT') private readonly chartRedis: Redis,
  ) {}
    async setChartData(key, value){
        this.chartRedis.set(key,value);
    }
    async getChartDate(keys){
        try{
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
                })
            );
            return results.filter(data => data !== null);
        }catch(error){
            console.error(error)
        }
    }
//   async setTradeData(
//     key: string,
//     value: string,
//     ttl?: number,
//   ): Promise<string> {
//     if (ttl) {
//       return this.tradeRedis.set(key, value, 'EX', ttl);
//     }
//     return this.tradeRedis.set(key, value);
//   }

//   async getTradeData(key: string): Promise<string | null> {
//     return this.tradeRedis.get(key);
//   }

//   async setAuthData(key: string, value: string, ttl?: number): Promise<string> {
//     if (ttl) {
//       return this.authRedis.set(key, value, 'EX', ttl);
//     }
//     return this.authRedis.set(key, value);
//   }

//   async getAuthData(key: string): Promise<string | null> {
//     return this.authRedis.get(key);
//   }

//   async getAuthDataKeys(pattern: string): Promise<string[]> {
//     return this.authRedis.keys(pattern);
//   }

//   async deleteAuthData(key: string): Promise<number> {
//     return this.authRedis.del(key);
//   }
}
