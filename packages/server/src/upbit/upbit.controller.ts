import { Controller, Sse, Query, Get } from '@nestjs/common';
import { Observable, Subject, concat } from 'rxjs';
import { SseService } from './sse.service';
import { CoinListService } from './coin-list.service';

@Controller('upbit')
export class UpbitController {
	constructor(
		private readonly sseService: SseService,
		private readonly coinListService: CoinListService,
	) {}

	@Sse('price-updates')
	priceUpdates(@Query('coins') coins: string[]): Observable<MessageEvent> {
		const initData = this.sseService.initPriceStream(coins,this.coinListService.marketCoinDto);
		return concat(
			initData,
			this.sseService.getPriceUpdatesStream(coins,this.coinListService.codeCoinDto),
		);
	}
	@Sse('orderbook')
	orderbookUpdates(@Query('coins') coins: string[]): Observable<MessageEvent> {
		return this.sseService.getOrderbookUpdatesStream(
			coins,
			this.coinListService.orderbookDto
		);
	}

	@Get('market/all')
	getAllMarkets() {
		return this.coinListService.getAllCoinList();
	}
	@Get('market/krw')
	getKRWMarkets() {
		return this.coinListService.getKRWCoinList();
	}
	@Get('market/btc')
	getBTCMarkets() {
		return this.coinListService.getBTCCoinList();
	}
	@Get('market/usdt')
	getUSDTMarkets() {
		return this.coinListService.getUSDTCoinList();
	}

	@Get('market/top20-trade/krw')
	getTop20TradeKRW() {
		return this.coinListService.getMostTradeCoin();
	}
	@Get('market/simplelist/krw')
	getSomeKRW(@Query('market') market: string[]){
		return this.coinListService.getSimpleCoin(market);
	}
}
