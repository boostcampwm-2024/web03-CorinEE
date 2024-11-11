import { Module } from '@nestjs/common';
import { UpbitService } from './upbit.service';
import { UpbitController } from './upbit.controller';
import { CoinListService } from './coin-list.service'
import { HttpModule } from '@nestjs/axios';
import { SseService } from './sse.service';

@Module({
  imports: [HttpModule],
  providers: [UpbitService, CoinListService, SseService],
  controllers: [UpbitController]
})
export class UpbitModule {}
