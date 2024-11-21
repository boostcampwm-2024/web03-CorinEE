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
            console.error("DB Searching Error : "+error)
        }
    }
    async getSimpleChartData(key){
        const data = await this.chartRedis.get(key);
        if(!data){
            return false;
        }else return JSON.parse(data)
    }
}
