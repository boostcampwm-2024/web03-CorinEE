import { Controller, Sse, Query } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { SseService } from './sse.service';
import { CoinTickerService } from './coin-ticker-websocket.service';
import { CoinListService } from './coin-list.service';

@Controller('upbit')
export class UpbitController {

  constructor(
    private readonly sseService: SseService,
    private readonly coinTickerService: CoinTickerService,
    private readonly coinListService: CoinListService
  ) {}

  @Sse('price-updates')
  priceUpdates(@Query('coins') coins:string[]): Observable<MessageEvent> {
    this.coinTickerService.sendWebSocket();
    return this.sseService.getPriceUpdatesStream(coins,this.coinListService.convertToTickerDTO);
  }
  
  // 상세페이지용
  // @Sse('price-updates-detail')
  // priceUpdatesDetail(@Query('coins') coins:string[]): Observable<MessageEvent> {
  //   this.upbitService.connectWebSocket(coins);
  //   return this.sseService.getPriceUpdatesStream();
  // }
}
