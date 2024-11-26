import { Controller, Sse, Query, Get, Param, Res, HttpStatus } from '@nestjs/common';
import { Observable, concat, concatAll, from, map } from 'rxjs';
import { SseService } from './SSE/sse.service';
import { CoinListService } from './coin-list.service';
import { ChartService } from './chart.service';
import { Response } from 'express';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('upbit')
export class UpbitController {
	constructor(
		private readonly sseService: SseService,
		private readonly coinListService: CoinListService,
		private readonly chartService: ChartService,
	) {}

	@Sse('price-updates')
	async priceUpdates(
		@Query('coins') coinsQuery?: string | string[],
	): Promise<Observable<MessageEvent>> {
		const coins = this.parseCoins(coinsQuery);

		const initData$ = from(
			this.sseService.initStream(
				coins,
				this.coinListService.convertToMarketCoinDto,
			),
		).pipe(concatAll());

		const updatesStream = this.sseService.getUpdatesStream(
			'price',
			coins,
			this.coinListService.convertToCodeCoinDto,
		);

		return concat(initData$, updatesStream);
	}
	@Sse('orderbook')
	orderbookUpdates(
		@Query('coins') coinsQuery?: string[],
	): Observable<MessageEvent> {
		const coins = this.parseCoins(coinsQuery);

		return this.sseService.getUpdatesStream(
			'orderbook',
			coins,
			this.coinListService.convertToOrderbookDto,
		);
	}

	@ApiOperation({ summary: 'Get all available markets' })
	@ApiResponse({
		status: 200,
		description: 'List of all coin markets',
	})
	@Get('market/all')
	getAllMarkets() {
		return this.coinListService.getAllCoinList();
	}

	@ApiOperation({ summary: 'Get KRW markets' })
	@Get('market/krw')
	getKRWMarkets() {
		return this.coinListService.getKRWCoinList();
	}
	@ApiOperation({ summary: 'Get BTC markets' })
	@Get('market/btc')
	getBTCMarkets() {
		return this.coinListService.getBTCCoinList();
	}
	@ApiOperation({ summary: 'Get USDT markets' })
	@Get('market/usdt')
	getUSDTMarkets() {
		return this.coinListService.getUSDTCoinList();
	}

	@ApiOperation({ summary: 'Get top 20 most traded KRW coins' })
	@Get('market/top20-trade/krw')
	getTop20TradeKRW() {
		return this.coinListService.getMostTradeCoin();
	}

	@ApiOperation({ summary: 'Get simple coin list for specific markets' })
	@Get('market/simplelist/krw')
	getSomeKRW(@Query('market') market: string[]) {
		return this.coinListService.getSimpleCoin(market || []);
	}

	@ApiOperation({ summary: 'Get coin tickers' })
	@ApiQuery({
		name: 'coins',
		required: false,
		description: 'Comma-separated list of coin codes',
	})
	@Get('market/tickers')
	@ApiQuery({ name: 'coins', required: false, type: String })
	getCoinTickers(@Query('coins') coins?: string) {
		return this.coinListService.getCoinTickers(coins ? coins.split(',') : []);
	}

	@ApiOperation({ summary: 'Get candlestick data' })
	@ApiQuery({ name: 'minute', required: false, type: String })
	@Get('candle/:type/:minute?')
	async getCandle(
		@Res() res: Response,
		@Param('type') type: string,
		@Query('market') market: string,
		@Query('to') to: string,
		@Param('minute') minute?: string,
	) {
		try {
			const response = await this.chartService.upbitApiDoor(
				type,
				market,
				to,
				minute,
			);

			return res.status(response.statusCode).json(response);
		} catch (error) {
			this.handleCandleError(res, error);
		}
	}

	private parseCoins(coinsQuery?: string | string[]): string[] {
		if (!coinsQuery) return [];

		return Array.isArray(coinsQuery)
			? coinsQuery
			: coinsQuery.split(',').map((coin) => coin.trim());
	}

  private handleCandleError(res: Response, error: any) {
    console.error('Candle fetch error:', error);
    
    return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message || '서버오류입니다.',
      error: error?.response || null,
    });
  }
}
