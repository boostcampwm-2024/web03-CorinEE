import {
  Controller,
  Sse,
  Query,
  Get,
  Param,
  Res,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Observable, concat, concatAll, from, map } from 'rxjs';
import { SseService } from './SSE/sse.service';
import { CoinListService } from './coin-list.service';
import { CoinDataUpdaterService } from '@src/upbit/coin-data-updater.service';
import { ChartService } from './chart.service';
import { Response } from 'express';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('업비트 API')
@Controller('upbit')
export class UpbitController {
  private readonly logger = new Logger(UpbitController.name);

  constructor(
    private readonly sseService: SseService,
    private readonly coinListService: CoinListService,
    private readonly chartService: ChartService,
    private readonly coinDataUpdaterService: CoinDataUpdaterService
  ) {}

  @ApiOperation({
    summary: '실시간 가격 업데이트',
    description: '지정된 코인들의 실시간 가격 정보를 SSE로 스트리밍합니다.',
  })
  @ApiQuery({
    name: 'coins',
    required: false,
    type: String,
    isArray: true,
    description: '코인 코드 목록 (예: BTC-KRW,ETH-KRW)',
  })
  @ApiResponse({
    status: 200,
    description: '실시간 가격 스트림',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            code: { type: 'string', example: 'BTC-KRW' },
            price: { type: 'number', example: 50000000 },
            change: { type: 'string', example: 'RISE' },
            changePrice: { type: 'number', example: 1000000 },
          },
        },
      },
    },
  })
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

  @ApiOperation({
    summary: '실시간 호가 업데이트',
    description: '지정된 코인들의 실시간 호가 정보를 SSE로 스트리밍합니다.',
  })
  @ApiQuery({
    name: 'coins',
    required: false,
    type: [String],
    description: '코인 코드 목록',
  })
  @ApiResponse({
    status: 200,
    description: '실시간 호가 스트림',
    schema: {
      type: 'object',
      properties: {
        market: { type: 'string' },
        orderbook_units: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              ask_price: { type: 'number' },
              bid_price: { type: 'number' },
              ask_size: { type: 'number' },
              bid_size: { type: 'number' },
            },
          },
        },
      },
    },
  })
  @Sse('orderbook')
  orderbookUpdates(
    @Query('coins') coinsQuery?: string[],
  ): Observable<MessageEvent> {
    const coins = this.parseCoins(coinsQuery);
    
    const initData$ = from(
      this.sseService.initOrderStream(
        coinsQuery,
        this.coinListService.convertToOrderbookDto,
      ),
    )

    const updatesStream = this.sseService.getUpdatesStream(
      'orderbook',
      coins,
      this.coinListService.convertToOrderbookDto,
    );
    return concat(initData$, updatesStream)
  }

  @ApiOperation({
    summary: '전체 마켓 조회',
    description: '업비트에서 거래 가능한 모든 마켓 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '마켓 목록 조회 성공',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          market: { type: 'string', example: 'KRW-BTC' },
          korean_name: { type: 'string', example: '비트코인' },
          english_name: { type: 'string', example: 'Bitcoin' },
        },
      },
    },
  })
  @Get('market/all')
  getAllMarkets() {
    return this.coinListService.getAllCoinList();
  }

  @ApiOperation({
    summary: 'KRW 마켓 조회',
    description: 'KRW로 거래 가능한 코인 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'KRW 마켓 목록 조회 성공',
  })
  @Get('market/krw')
  getKRWMarkets() {
    return this.coinListService.getKRWCoinList();
  }

  @ApiOperation({
    summary: 'BTC 마켓 조회',
    description: 'BTC로 거래 가능한 코인 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'BTC 마켓 목록 조회 성공',
  })
  @Get('market/btc')
  getBTCMarkets() {
    return this.coinListService.getBTCCoinList();
  }

  @ApiOperation({
    summary: 'USDT 마켓 조회',
    description: 'USDT로 거래 가능한 코인 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'USDT 마켓 목록 조회 성공',
  })
  @Get('market/usdt')
  getUSDTMarkets() {
    return this.coinListService.getUSDTCoinList();
  }

  @ApiOperation({
    summary: 'KRW 마켓 거래량 TOP 20',
    description: 'KRW 마켓에서 거래량이 가장 많은 상위 20개 코인을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'TOP 20 코인 목록 조회 성공',
  })
  @Get('market/top20-trade/krw')
  getTop20TradeKRW() {
    return this.coinListService.getMostTradeCoin();
  }

  @ApiOperation({
    summary: '간단한 코인 목록 조회',
    description: '지정된 마켓의 간단한 코인 정보를 조회합니다.',
  })
  @ApiQuery({
    name: 'market',
    required: true,
    type: [String],
    description: '조회할 마켓 코드 목록',
  })
  @ApiResponse({
    status: 200,
    description: '코인 정보 조회 성공',
  })
  @Get('market/simplelist/krw')
  getSomeKRW(@Query('market') market: string[]) {
    return this.coinListService.getSimpleCoin(market);
  }

  @ApiOperation({
    summary: '코인 시세 조회',
    description: '지정된 코인들의 현재 시세 정보를 조회합니다.',
  })
  @ApiQuery({
    name: 'coins',
    required: false,
    type: String,
    description: '콤마로 구분된 코인 코드 목록 (예: BTC-KRW,ETH-KRW)',
  })
  @ApiResponse({
    status: 200,
    description: '코인 시세 조회 성공',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          market: { type: 'string', example: 'KRW-BTC' },
          trade_price: { type: 'number', example: 50000000 },
          change: { type: 'string', example: 'RISE' },
          change_rate: { type: 'number', example: 0.02 },
        },
      },
    },
  })
  @Get('market/tickers')
  getCoinTickers(@Query('coins') coins?: string) {
    return this.coinListService.getCoinTickers(coins);
  }

  @ApiOperation({
    summary: '차트 데이터 조회',
    description: '코인의 캔들스틱 차트 데이터를 조회합니다.',
  })
  @ApiParam({
    name: 'type',
    required: true,
    enum: ['minutes', 'days', 'weeks', 'months'],
    description: '차트 타입',
  })
  @ApiParam({
    name: 'minute',
    required: false,
    enum: ['1', '3', '5', '15', '30', '60', '240'],
    description: 'minutes 타입일 경우 분 단위',
  })
  @ApiQuery({
    name: 'market',
    required: true,
    type: String,
    description: '마켓 코드 (예: KRW-BTC)',
  })
  @ApiQuery({
    name: 'to',
    required: true,
    type: String,
    description: '기준 시점 (yyyy-MM-dd HH:mm:ss)',
  })
  @ApiResponse({
    status: 200,
    description: '차트 데이터 조회 성공',
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청',
  })
  @ApiResponse({
    status: 500,
    description: '서버 오류',
  })
  @Get('candle/:type/:minute?')
  async getCandle(
    @Res() res: Response,
    @Param('type') type: string,
    @Query('market') market: string,
    @Query('to') to: string,
    @Param('minute') minute?: string,
  ) {
    try {
      this.logger.log("차트 읽는 중 ")
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
    this.logger.error('Candle fetch error:', error);

    return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message || '서버오류입니다.',
      error: error?.response || null,
    });
  }

  @ApiOperation({
    summary: '코인 데이터 검색',
    description: '코인 데이터를 검색합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '코인 데이터 검색 성공',
  })
  @Get('search')
  async searchCoin(
    @Query('data') data: string,
  ){
    return this.coinDataUpdaterService.searchCoinData(data);
  }
}
