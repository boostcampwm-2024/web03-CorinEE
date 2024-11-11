import { Controller, Sse, Query } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { SseService } from './sse.service';
import { UpbitService } from './upbit.service';
import { CoinListService } from './coin-list.service';

@Controller('upbit')
export class UpbitController {

<<<<<<< HEAD
  constructor(
    private readonly sseService: SseService,
    private readonly upbitService: UpbitService,
    private readonly coinListService: CoinListService
  ) {}

  @Sse('price-updates')
  priceUpdates(@Query('coins') coins:string[]): Observable<MessageEvent> {
    this.upbitService.connectWebSocket(coins);
    this.upbitService.sendWebSocket(this.coinListService.convertToTickerDTO)
    return this.sseService.getPriceUpdatesStream();
=======
  private destroy$ = new Subject<void>();

  constructor(private readonly upbitService: UpbitService) {}

  @Sse('price-updates')
  priceUpdates(): Observable<MessageEvent> {
    return this.upbitService.getPriceUpdatesStream()
    .pipe(
      takeUntil(this.destroy$),
      map((data) => {
        // MessageEvent 타입에 맞게 필요한 속성 추가
        return new MessageEvent('price-update', {
          data: JSON.stringify(data), // 실제 데이터
        }) as MessageEvent;
      }),
    );
>>>>>>> ba0e1a6 (feat: 코인 정보 upbit api로 받아오기)
  }
  // 상세페이지용
  // @Sse('price-updates-detail')
  // priceUpdatesDetail(@Query('coins') coins:string[]): Observable<MessageEvent> {
  //   this.upbitService.connectWebSocket(coins);
  //   return this.sseService.getPriceUpdatesStream();
  // }
}
