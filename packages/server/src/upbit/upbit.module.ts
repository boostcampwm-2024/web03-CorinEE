import { Module, Global } from '@nestjs/common';
import { CoinTickerService } from './coin-ticker-websocket.service';
import { UpbitController } from './upbit.controller';
import { CoinListService } from './coin-list.service';
import { HttpModule } from '@nestjs/axios';
import { SseService } from './sse.service';
import { OrderbookService } from './orderbook-websocket.service';
import { CoinDataUpdaterService } from './coin-data-updater.service';
import { getRedisConfig } from '@src/configs/redis.config';
import { Redis } from 'ioredis';
import { ChartRepository } from './chart.repository';
import { ChartService } from './chart.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: 'CHART_REDIS_CLIENT', // Auth용 Redis 클라이언트
      useFactory: () => {
        const config = getRedisConfig();
        const client = new Redis({ ...config, db: 3 }); // DB 2로 설정
        client.on('connect', () => console.log('Chart용 Redis 연결 성공'));
        client.on('error', (error) =>
          console.error('Auth용 Redis 연결 실패:', error),
        );
        return client;
      },
    },
    ChartRepository,
    CoinTickerService,
    CoinListService,
    SseService,
    OrderbookService,
    CoinDataUpdaterService,
    ChartService
  ],
  controllers: [UpbitController],
  exports: [CoinDataUpdaterService],
})
export class UpbitModule {}
