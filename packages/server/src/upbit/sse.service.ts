import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { map, takeUntil, filter } from 'rxjs/operators';

@Injectable()
export class SseService implements OnModuleDestroy{
	private coinTickerStream$ = new Subject<any>();
	private orderbookStream$ = new Subject<any>();
	private coinTickerdestroy$ = new Subject<void>();
	private orderbookdestroy$ = new Subject<void>();
	private coinTicker = 0;
	coinTickerData(data: any) {
		this.coinTicker++;
		this.coinTickerStream$.next(data);
	}
	orderbookData(data:any){
		this.orderbookStream$.next(data);
	}

	getPriceUpdatesStream(coins, dto:Function): Observable<MessageEvent> {
		return this.coinTickerStream$.asObservable().pipe(
			takeUntil(this.coinTickerdestroy$),
			filter((data)=>coins.includes(data.code)),
			map((data) => {
				//const setDto = dto(data);
				return new MessageEvent('price-update', {
					//data: JSON.stringify(setDto),
					data: JSON.stringify(data),
				}) as MessageEvent;
			}),
		);
	}
	
	getOrderbookUpdatesStream(coins, dto:Function): Observable<MessageEvent> {
		return this.orderbookStream$.asObservable().pipe(
			takeUntil(this.orderbookdestroy$),
			filter((data)=> coins.includes(data.code)),
			map((data) => {
				//const setDto = dto(data);
				return new MessageEvent('orderbook-update', {
					//data: JSON.stringify(setDto),
					data: JSON.stringify(data),
				}) as MessageEvent;
			}),
		);
	}
	onModuleDestroy() {
		this.coinTickerdestroy$.next();
		this.orderbookdestroy$.next();
	}
}
