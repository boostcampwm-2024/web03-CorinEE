import { Controller, Sse } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { SseService } from './sse.service';

@Controller('upbit')
export class UpbitController {

  private destroy$ = new Subject<void>();

  constructor(private readonly sseService: SseService) {}

  @Sse('price-updates')
  priceUpdates(): Observable<MessageEvent> {
    return this.sseService.getPriceUpdatesStream()
    .pipe(
      takeUntil(this.destroy$),
      map((data) => {
        return new MessageEvent('price-update', {
          data: JSON.stringify(data),
        }) as MessageEvent;
      }),
    );
  }
}
