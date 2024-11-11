import { Controller, Sse, Query } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { SseService } from './sse.service';
import { UpbitService } from './upbit.service';
import { CoinListService } from './coin-list.service';

@Controller('upbit')
export class UpbitController {

  constructor(
    private readonly sseService: SseService,
    private readonly upbitService: UpbitService,
    private readonly coinListService: CoinListService
  ) {}

  @Sse('price-updates')
  priceUpdates(@Query('coins') coins:string[]): Observable<MessageEvent> {
    this.upbitService.connectWebSocket();
    this.upbitService.sendWebSocket(this.coinListService.convertToTickerDTO, coins)
    
    return this.sseService.getPriceUpdatesStream();
  }
  
  // 상세페이지용
  // @Sse('price-updates-detail')
  // priceUpdatesDetail(@Query('coins') coins:string[]): Observable<MessageEvent> {
  //   this.upbitService.connectWebSocket(coins);
  //   return this.sseService.getPriceUpdatesStream();
  // }
}
