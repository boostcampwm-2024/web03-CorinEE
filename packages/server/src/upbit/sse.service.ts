import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { map, takeUntil, filter } from 'rxjs/operators';
import { CoinTickerService } from './coin-ticker-websocket.service';

@Injectable()
export class SseService implements OnModuleDestroy{
	private coinTickerStream$ = new Subject<any>();
	private orderbookStream$ = new Subject<any>();
	private coinTickerdestroy$ = new Subject<void>();
	private orderbookdestroy$ = new Subject<void>();
	private coinLatestInfo = new Map();
	constructor(
	){}
	coinTickerData(data: any) {
		this.coinTickerStream$.next(data);
	}
	orderbookData(data:any){
		this.orderbookStream$.next(data);
	}
	setCoinLastestInfo(coin){
		this.coinLatestInfo.set(coin.code, coin);
	}
	initPriceStream(coins, dto: Function) {
		const events: MessageEvent[] = []; 
		if (coins && typeof coins === 'string') {
			coins = [coins];
		}
		coins.forEach(async (coin) => {
			while (this.coinLatestInfo.get(coin) === undefined) {
				await new Promise(resolve => setTimeout(resolve, 100));
			}
			const initData = this.coinLatestInfo.get(coin); 
			const setDto = dto(initData);
			const msgEvent = new MessageEvent('price-update', {
				data: JSON.stringify(setDto),
			}) as MessageEvent;
				
			events.push(msgEvent); 
		});
	  
		return events;
	  }
	getPriceUpdatesStream(coins, dto:Function): Observable<MessageEvent> {
		return this.coinTickerStream$.asObservable().pipe(
			takeUntil(this.coinTickerdestroy$),
			filter((data)=>coins.includes(data.code)),
			map((data) => {
				const setDto = dto(data);
				return new MessageEvent('price-update', {
					data: JSON.stringify(setDto),
				}) as MessageEvent;
			}),
		);
	}
	
	getOrderbookUpdatesStream(coins, dto:Function): Observable<MessageEvent> {
		return this.orderbookStream$.asObservable().pipe(
			takeUntil(this.orderbookdestroy$),
			filter((data)=> coins.includes(data.code)),
			map((data) => {
				const setDto = dto(data);
				return new MessageEvent('orderbook-update', {
					data: JSON.stringify(setDto),
				}) as MessageEvent;
			}),
		);
	}
	onModuleDestroy() {
		this.coinTickerdestroy$.next();
		this.orderbookdestroy$.next();
	}
}
