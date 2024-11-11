import { Controller, Sse } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { SseService } from './sse.service';

@Controller('upbit')
export class UpbitController {

  constructor(private readonly sseService: SseService) {}

  @Sse('price-updates')
  priceUpdates(): Observable<MessageEvent> {
    return this.sseService.getPriceUpdatesStream()
  }
}
