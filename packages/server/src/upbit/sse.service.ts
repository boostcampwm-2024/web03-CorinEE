import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Injectable()
export class SseService implements OnModuleDestroy{
	private eventStream$ = new Subject<any>();
	private destroy$ = new Subject<void>();

	sendEvent(data: any) {
		if(data!==null) this.eventStream$.next(data);
	}

	getPriceUpdatesStream(): Observable<MessageEvent> {
		return this.eventStream$.asObservable().pipe(
			takeUntil(this.destroy$),
			map((data) => {
				return new MessageEvent('price-update', {
					data: JSON.stringify(data),
				}) as MessageEvent;
			}),
		);
	}
	
	onModuleDestroy() {
		this.destroy$.next();
	}
}
