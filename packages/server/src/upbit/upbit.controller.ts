import { Controller, Sse, Query, Get } from '@nestjs/common';
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
    return this.sseService.getPriceUpdatesStream(coins,this.coinListService.tempCoinAddNameAndUrl);
  }
  @Sse('orderbook')
  orderbookUpdates(@Query('coins') coins:string[]): Observable<MessageEvent> {
    return this.sseService.getOrderbookUpdatesStream(coins,this.coinListService.convertToTickerDTO);
  }
  // 상세페이지용
  // @Sse('price-updates-detail')
  // priceUpdatesDetail(@Query('coins') coins:string[]): Observable<MessageEvent> {
  //   this.upbitService.connectWebSocket(coins);
  //   return this.sseService.getPriceUpdatesStream();
  // }
  @Get('market/all')
  getAllMarkets() {
    return this.coinListService.getAllCoinList();
  }
  @Get('market/krw')
  getKRWMarkets() {
    return this.coinListService.getKRWCoinList();
  }
  @Get('market/btc')
  getBTCMarkets() {
    return this.coinListService.getBTCCoinList();
  }
  @Get('market/usdt')
  getUSDTMarkets() {
    return this.coinListService.getUSDTCoinList();
  }
}
