import { Controller, Sse, Query, Get, Param, Res } from '@nestjs/common';
import { Observable, concat } from 'rxjs';
import { SseService } from './sse.service';
import { CoinListService } from './coin-list.service';
import { ChartService } from './chart.service';
import { Response } from 'express';
import { ApiQuery } from '@nestjs/swagger';

@Controller('upbit')
export class UpbitController {
  constructor(
    private readonly sseService: SseService,
    private readonly coinListService: CoinListService,
    private readonly chartService : ChartService
  ) {}

  @Sse('price-updates')
  priceUpdates(@Query('coins') coins: string[]): Observable<MessageEvent> {
    coins = coins || [];
    const initData = this.sseService.initPriceStream(
      coins,
      this.coinListService.convertToMarketCoinDto,
    );
    return concat(
      initData,
      this.sseService.getPriceUpdatesStream(
        coins,
        this.coinListService.convertToCodeCoinDto,
      ),
    );
  }
  @Sse('orderbook')
  orderbookUpdates(@Query('coins') coins: string[]): Observable<MessageEvent> {
    coins = coins || [];
    return this.sseService.getOrderbookUpdatesStream(
      coins,
      this.coinListService.convertToOrderbookDto,
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
  getSomeKRW(@Query('market') market: string[]) {
    const marketList = market || [];
    return this.coinListService.getSimpleCoin(marketList);
  }

  @Get('candle/:type/:minute?')
  @ApiQuery({ name: 'minute', required: false, type: String })
  async getCandle(
    @Res() res: Response,
    @Param('type') type : string,
    @Query('market') market: string, 
    @Query('to') to:string,
    @Param('minute') minute? :string
  ){
    try{
      console.log("type : "+type)
      console.log("market : "+market)
      console.log("minute : "+minute)
      console.log("to : "+to)
      const response = await this.chartService.upbitApiDoor(type, market, to, minute)

      return res.status(response.statusCode).json(response)
    }catch(error){
      console.error("error"+error)
      return res.status(error.status)
        .json({
          message: error.message || '서버오류입니다.',
          error: error?.response || null,
        });;
    }
  }
}
