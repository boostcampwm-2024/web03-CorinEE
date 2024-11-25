import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  UPBIT_CURRENT_ORDERBOOK_URL,
  UPBIT_CURRENT_PRICE_URL,
  UPBIT_RESTAPI_URL,
  UPBIT_UPDATED_COIN_INFO_TIME,
  UPBIT_UPDATED_COIN_LIST_TIME,
} from 'common/upbit';

@Injectable()
export class CoinDataUpdaterService {
  private coinRawList: any;
  private coinCodeList: string[] = ['KRW-BTC'];
  private coinNameList: Map<string, string>;
  private coinListTimeoutId: NodeJS.Timeout | null = null;
  private coinCurrentPriceTimeoutId: NodeJS.Timeout | null = null;
  private coinCurrentOrderBookTimeoutId: NodeJS.Timeout | null = null;
  private coinLatestInfo = new Map();
  private krwCoinInfo: any[] = [];
  private orderbookLatestInfo = new Map();

  constructor(private readonly httpService: HttpService) {}

  async updateCoinList() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(UPBIT_RESTAPI_URL),
      );
      this.coinCodeList = response.data.map((coin) => coin.market);
      this.coinNameList = new Map(
        response.data.map((coin) => [coin.market, coin.korean_name]),
      );
      this.coinRawList = response.data;
    } catch (error) {
      console.error('getCoinListFromUpbit error:', error);
    } finally {
      console.log(`코인 목록 최신화: ${Date()}`);
      if (this.coinListTimeoutId) clearTimeout(this.coinListTimeoutId);
      this.coinListTimeoutId = setTimeout(
        () => this.updateCoinList(),
        UPBIT_UPDATED_COIN_LIST_TIME,
      );
    }
  }

  async updateCoinCurrentPrice() {
    try {
      while (this.coinCodeList.length === 1)
        await new Promise((resolve) => setTimeout(resolve, 100));
      const response = await firstValueFrom(
        this.httpService.get(
          `${UPBIT_CURRENT_PRICE_URL}markets=${this.coinCodeList.join(',')}`,
        ),
      );
      this.coinLatestInfo = new Map(
        response.data.map((coin) => [coin.market, coin]),
      );
      this.krwCoinInfo = response.data.filter((coin) =>
        coin.market.startsWith('KRW'),
      );
    } catch (error) {
      console.error('getCoinListFromUpbit error:', error);
    } finally {
      console.log(`코인 현재가 정보 최신화: ${Date()}`);
      if (this.coinCurrentPriceTimeoutId)
        clearTimeout(this.coinCurrentPriceTimeoutId);
      this.coinCurrentPriceTimeoutId = setTimeout(
        () => this.updateCoinCurrentPrice(),
        UPBIT_UPDATED_COIN_INFO_TIME,
      );
    }
  }

  async updateCurrentOrderBook() {
    try {
      while (this.coinCodeList.length === 1)
        await new Promise((resolve) => setTimeout(resolve, 100));
      const response = await firstValueFrom(
        this.httpService.get(
          `${UPBIT_CURRENT_ORDERBOOK_URL}markets=${this.coinCodeList.join(',')}`,
        ),
      );
      this.orderbookLatestInfo = new Map(
        response.data.map((coin) => [coin.market, coin]),
      );
    } catch (error) {
      console.error('getCoinListFromUpbit error:', error);
    } finally {
      console.log(`코인 호가 정보 최신화: ${Date()}`);
      if (this.coinCurrentOrderBookTimeoutId)
        clearTimeout(this.coinCurrentOrderBookTimeoutId);
      this.coinCurrentOrderBookTimeoutId = setTimeout(
        () => this.updateCurrentOrderBook(),
        UPBIT_UPDATED_COIN_INFO_TIME,
      );
    }
  }
  getCoinCodeList() {
    return this.coinCodeList;
  }

  getCoinNameList() {
    return this.coinNameList;
  }

  getAllCoinList() {
    return this.coinRawList;
  }

  getKrwCoinInfo() {
    return this.krwCoinInfo;
  }

  getCoinLatestInfo() {
    return this.coinLatestInfo;
  }

  getCoinOrderbookInfo() {
    return this.orderbookLatestInfo;
  }

  getCoinOrderbookByBid(buyDto) {
    const { typeGiven, typeReceived } = buyDto;
    const code = [typeGiven, typeReceived].join('-');

    const coinOrderbook = this.orderbookLatestInfo.get(code).orderbook_units;
    return coinOrderbook;
  }
  getCoinOrderbookByAsk(buyDto) {
    const { typeGiven, typeReceived } = buyDto;
    const code = [typeReceived, typeGiven].join('-');

    const coinOrderbook = this.orderbookLatestInfo.get(code).orderbook_units;
    return coinOrderbook;
  }
}
