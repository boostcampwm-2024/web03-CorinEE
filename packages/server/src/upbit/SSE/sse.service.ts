import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { map, takeUntil, filter } from 'rxjs/operators';
import { CoinDataUpdaterService } from '../coin-data-updater.service';
import { UPBIT_IMAGE_URL } from '../constants';

@Injectable()
export class SseService implements OnModuleDestroy {
  private streams = new Map<string, Subject<any>>();
  private destroy$ = new Subject<void>();

  constructor(private readonly coinDataUpdaterService: CoinDataUpdaterService) {
    this.streams.set('price', new Subject<any>());
    this.streams.set('orderbook', new Subject<any>());
  }

  sendEvent(type: 'price' | 'orderbook', data: any) {
    const stream = this.streams.get(type);
    if (stream) {
      stream.next(data);
    }
  }

  async initStream(
    coins: string[],
    dto: (data: any) => any,
  ): Promise<MessageEvent[]> {
    const coinData = await Promise.all(
      coins.map(async (coin) => {
        let coinLatestInfo = this.coinDataUpdaterService.getCoinLatestInfo();

        while (!coinLatestInfo.size || !coinLatestInfo.get(coin)) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          coinLatestInfo = this.coinDataUpdaterService.getCoinLatestInfo();
        }

        const initData = coinLatestInfo.get(coin);
        return new MessageEvent('price-update', {
          data: JSON.stringify(dto(initData)),
        });
      }),
    );

    return coinData;
  }

  async initOrderStream(
    coin: string,
    dto: (data: any) => any,
  ): Promise<MessageEvent> {
    let coinLatestInfo = this.coinDataUpdaterService.getCoinOrderbookInfo();
    
    while (!coinLatestInfo.size || !coinLatestInfo.get(coin)) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      coinLatestInfo = this.coinDataUpdaterService.getCoinLatestInfo();
    }

    const initData = coinLatestInfo.get(coin);
    initData.type = "orderbook"
    initData.stream_type = "REALTIME"
    initData.code = initData.market;
    
    const dtoData = dto(initData)
    delete dtoData.market;
    return new MessageEvent('orderbook-update', {
      data: JSON.stringify(dtoData),
    });
  }

  getUpdatesStream(
    type: 'price' | 'orderbook',
    coins: string[],
    dto: (data: any) => any,
  ): Observable<MessageEvent> {
    const stream = this.streams.get(type);
    if (!stream) {
      throw new Error(`Stream for type ${type} not found`);
    }

    return stream.asObservable().pipe(
      takeUntil(this.destroy$),
      filter((data) => coins.includes(data.code)),
      map((data) => {
        return new MessageEvent(`${type}-update`, {
          data: JSON.stringify(dto(data)),
        });
      }),
    );
  }

  onModuleDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.streams.forEach((stream) => stream.complete());
  }
}
