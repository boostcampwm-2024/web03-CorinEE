import { Module } from '@nestjs/common';
import { CoinTickerService } from './coin-ticker-websocket.service';
import { UpbitController } from './upbit.controller';
import { CoinListService } from './coin-list.service'
import { HttpModule } from '@nestjs/axios';
import { SseService } from './sse.service';
import { OrderbookService } from './orderbook-websocket.service';
@Module({
  imports: [HttpModule],
  providers: [CoinTickerService, CoinListService, SseService,OrderbookService],
  controllers: [UpbitController]
})
export class UpbitModule {}
