import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SseService {
  private eventStream$ = new Subject<any>();

  // 데이터 스트림 방출
  sendEvent(data: any) {
    this.eventStream$.next(data);
  }

  // SSE 컨트롤러에서 구독할 스트림 반환
  getPriceUpdatesStream(): Observable<MessageEvent> {
    return this.eventStream$.asObservable();
  }
}
