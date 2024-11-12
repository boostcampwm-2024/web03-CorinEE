import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { map, takeUntil, filter } from 'rxjs/operators';

@Injectable()
export class SseService implements OnModuleDestroy{
	private eventStream$ = new Subject<any>();
	private destroy$ = new Subject<void>();

	sendEvent(data: any) {
		this.eventStream$.next(data);
	}

	getPriceUpdatesStream(coins, dto:Function): Observable<MessageEvent> {
		return this.eventStream$.asObservable().pipe(
			takeUntil(this.destroy$),
			filter((data)=>coins.includes(data.code)),
			map((data) => {
				const setDto = dto(data);
				return new MessageEvent('price-update', {
					data: JSON.stringify(setDto),
				}) as MessageEvent;
			}),
		);
	}
	
	onModuleDestroy() {
		this.destroy$.next();
	}
}
