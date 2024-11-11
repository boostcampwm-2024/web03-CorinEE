import { Controller, Sse } from '@nestjs/common';
import { UpbitService } from './upbit.service';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Controller('upbit')
export class UpbitController {

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
  }
}
