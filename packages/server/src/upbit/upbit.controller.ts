import { Controller, Sse } from '@nestjs/common';
import { UpbitService } from './upbit.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller('upbit')
export class UpbitController {
  constructor(private readonly upbitService: UpbitService) {}

  @Sse('price-updates')
  priceUpdates(): Observable<MessageEvent> {
    return this.upbitService.getPriceUpdatesStream().pipe(
      map((data) => {
        // MessageEvent 타입에 맞게 필요한 속성 추가
        return new MessageEvent('price-update', {
          data: JSON.stringify(data), // 실제 데이터
        }) as MessageEvent;
      }),
    );
  }
}
