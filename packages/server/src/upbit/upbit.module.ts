import { Module } from '@nestjs/common';
import { CoinTickerService } from './coin-ticker-websocket.service';
import { UpbitController } from './upbit.controller';
import { CoinListService } from './coin-list.service'
import { HttpModule } from '@nestjs/axios';
import { SseService } from './sse.service';

@Module({
  imports: [HttpModule],
  providers: [CoinTickerService, CoinListService, SseService],
  controllers: [UpbitController]
})
export class UpbitModule {}
