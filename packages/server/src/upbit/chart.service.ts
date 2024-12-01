import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import {
  ONE_SECOND,
  UPBIT_CANDLE_URL,
  UPBIT_REQUEST_SIZE,
} from '@src/upbit/constants';
import { CandleDto } from './dtos/candle.dto';
import { ChartRedisRepository } from '@src/redis/chart-redis.repository';
import { isValidMinute } from './utils/validation';

@Injectable()
export class ChartService implements OnModuleInit {
  private upbitApiQueue: number[] = [];
  private readonly logger = new Logger(ChartService.name);

  constructor(
    private readonly httpService: HttpService,
    private redisRepository: ChartRedisRepository,
  ) {}

  onModuleInit() {
    this.cleanQueue();
  }

  async upbitApiDoor(type: string, coin: string, to?: string, minute?: string) {
    if (type === 'minutes' && (!minute || !isValidMinute(minute))) {
      throw new BadRequestException('유효하지 않은 분봉 값입니다.');
    }

    to = to || this.formatCurrentTime();
  
    const key = await this.getAllKeys(coin, to, type, minute);

    const result = await this.waitForTransactionOrder(key);

    if (result) {
      return this.buildResponse(200, result);
    }

    return this.fetchAndSaveUpbitData(type, coin, to, minute);
  }

  private formatCurrentTime(): string {
    const now = new Date();
    now.setHours(now.getHours() + 9);
    return now.toISOString().slice(0, 19);
  }

  private buildResponse(statusCode: number, result: any) {
    return { statusCode, result };
  }

  private async fetchAndSaveUpbitData(
    type: string,
    coin: string,
    to: string,
    minute?: string,
  ) {
    try {
      this.upbitApiQueue.push(Date.now());
      const url = this.buildUpbitUrl(type, coin, to, minute);
      const response = await firstValueFrom(this.httpService.get(url));

      const candles: CandleDto[] = response.data;

      await this.saveChartData(candles, type, minute);
      return this.buildResponse(200, candles);
    } catch (error) {
      this.logger.error('Error in fetchAndSaveUpbitData:', error);
      throw error;
    }
  }

  private buildUpbitUrl(
    type: string,
    coin: string,
    to: string,
    minute?: string,
  ): string {
    const baseUrl = `${UPBIT_CANDLE_URL}${type}`;
    const query = `market=${coin}&count=200&to=${to}`;
    return type === 'minutes'
      ? `${baseUrl}/${minute}?${query}`
      : `${baseUrl}?${query}`;
  }

  async waitForTransactionOrder(key, maxRetries = 10000, retryDelay = 10): Promise<any> {
    let retryCount = 0;
  
    const checkTransaction = async () => {
      try {
        const dbData = await this.redisRepository.getChartDate(key);

        if (dbData.length === 200) {
          return dbData;
        }
        const queueSize = this.upbitApiQueue.length;
        if (
          queueSize < UPBIT_REQUEST_SIZE ||
          this.upbitApiQueue[queueSize - 1] - Date.now() < -ONE_SECOND
        ) {
          return false;
        }
        if (retryCount++ >= maxRetries) {
          this.logger.error('Timeout waiting for transaction order')
          throw new Error('Timeout waiting for transaction order');
        }
        return new Promise((resolve) => setTimeout(() => resolve(checkTransaction()), retryDelay));
      } catch (error) {
        throw error;
      }
    };
  
    return checkTransaction();
  }
  async saveChartData(candles, type, minute) {
    try {
      const savePromises = candles.map((candle) => {
        const key = this.getRedisKey(
          candle.market,
          candle.candle_date_time_kst,
          type,
          minute,
        );
        return this.redisRepository.setChartData(key, JSON.stringify(candle));
      });

      await Promise.all(savePromises);
    } catch (error) {
      this.logger.error('saveChartData Error :', error);
      throw error;
    }
  }

  getRedisKey(market, kst, type, minute = null) {
    const formattedDateTime = kst.replace(/[-T]/g, ':');
    const parts = formattedDateTime.split(':');

    const keyFormats = {
      years: () => `${market}:${parts[0]}`,
      months: () => `${market}:${parts[0]}:${parts[1]}`,
      days: () => `${market}:${parts[0]}:${parts[1]}:${parts[2]}`,
      weeks: () => `${market}:${parts[0]}:${parts[1]}:${parts[2]}:W`,
      minutes: () => {
        return `${market}:${parts[0]}:${parts[1]}:${parts[2]}:${parts[3]}:${parts[4]}:${minute}M`;
      },
      seconds: () =>
        `${market}:${parts[0]}:${parts[1]}:${parts[2]}:${parts[3]}:${parts[4]}:${parts[5]}`,
    };

    const formatFn = keyFormats[type];
    if (!formatFn) {
      throw new Error(`Invalid type: ${type}`);
    }

    return formatFn();
  }

  formatNumber(num) {
    return String(num).padStart(2, '0');
  }

  decrementDate(date, type) {
    date = new Date(date)
    const decrementFunctions = {
      years: () => date.setFullYear(date.getFullYear() - 1),
      months: () => date.setMonth(date.getMonth() - 1),
      weeks: () => date.setDate(date.getDate() - 7),
      days: () => date.setDate(date.getDate() - 1),
      minutes: () => date.setMinutes(date.getMinutes() - 1),
      seconds: () => date.setSeconds(date.getSeconds() - 1),
    };

    if (!decrementFunctions[type]) {
      throw new Error(`Invalid type: ${type}`);
    }

    decrementFunctions[type]();
    return date;
  }

  getAllKeys(coin, to, type, minute = null, count = 200) {
    const result = [];
    
    for (let i = 0; i < count; i++) {
      result.push(this.getRedisKey(coin, to, type, minute));
      this.decrementDate(to, type);
    }
    return result;
  }
  cleanQueue() {
    while (
      this.upbitApiQueue.length > 0 &&
      this.upbitApiQueue[0] - Date.now() < -ONE_SECOND
    ) {
      this.upbitApiQueue.shift();
    }
    setTimeout(() => this.cleanQueue(), 100);
  }
}
