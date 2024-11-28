import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
	UPBIT_CURRENT_ORDERBOOK_URL,
	UPBIT_CURRENT_PRICE_URL,
	UPBIT_IMAGE_URL,
	UPBIT_RESTAPI_URL,
	UPBIT_UPDATED_COIN_INFO_TIME,
	UPBIT_UPDATED_COIN_LIST_TIME,
} from '@src/upbit/constants';

@Injectable()
export class CoinDataUpdaterService implements OnModuleInit {
	private readonly logger = new Logger(CoinDataUpdaterService.name);

	private coinRawList: any;
	private coinCodeList: string[] = ['KRW-BTC'];
	private coinNameList: Map<string, string>;
	private coinLatestInfo = new Map();
	private krwCoinInfo: any[] = [];
	private orderbookLatestInfo = new Map();

	private timeouts = {
		coinList: null as NodeJS.Timeout | null,
		currentPrice: null as NodeJS.Timeout | null,
		currentOrderBook: null as NodeJS.Timeout | null,
	};

	constructor(private readonly httpService: HttpService) {}

	async onModuleInit() {
		await this.initializeCoinData();
	}

	private async initializeCoinData(): Promise<void> {
		try {
			await Promise.all([
				this.updateCoinList(),
				this.updateCoinCurrentPrice(),
				this.updateCurrentOrderBook(),
			]);
		} catch (error) {
			this.logger.error('Failed to initialize coin data', error);
		}
	}

	async updateCoinList() {
		try {
			const response = await this.fetchData(UPBIT_RESTAPI_URL);

			this.processCoinList(response.data);
		} catch (error) {
			console.log(error);
			this.logger.error('Failed to update coin list:', error);
		} finally {
			this.scheduleNextUpdate(
				'coinList',
				UPBIT_UPDATED_COIN_LIST_TIME,
				this.updateCoinList.bind(this),
			);
		}
	}

	async updateCoinCurrentPrice() {
		try {
			await this.ensureCoinCodeListIsLoaded();
			const url = `${UPBIT_CURRENT_PRICE_URL}markets=${this.coinCodeList.join(',')}`;
			const response = await this.fetchData(url);

			this.processCurrentPrice(response.data);
		} catch (error) {
			this.logger.error(`Failed to update current prices: ${error}`);
		} finally {
			this.scheduleNextUpdate(
				'currentPrice',
				UPBIT_UPDATED_COIN_INFO_TIME,
				this.updateCoinCurrentPrice.bind(this),
			);
		}
	}

	async updateCurrentOrderBook() {
		try {
			await this.ensureCoinCodeListIsLoaded();
			const url = `${UPBIT_CURRENT_ORDERBOOK_URL}markets=${this.coinCodeList.join(',')}`;
			const response = await this.fetchData(url);

			this.processOrderBook(response.data);
		} catch (error) {
			this.logger.error('Failed to update order book:', error);
		} finally {
			this.scheduleNextUpdate(
				'currentOrderBook',
				UPBIT_UPDATED_COIN_INFO_TIME,
				this.updateCurrentOrderBook.bind(this),
			);
		}
	}

	private async fetchData(url: string): Promise<any> {
		try {
			return firstValueFrom(this.httpService.get(url));
		} catch (error) {
			this.logger.error(`Failed to fetch data from ${url}:`, error);
			throw error;
		}
	}

	private processCoinList(data: any[]) {
		this.coinCodeList = data.map((coin) => coin.market);
		this.coinNameList = new Map(
			data.map((coin) => [coin.market, coin.korean_name]),
		);
		this.coinRawList = data;
		this.logger.log(`Updated coin list`);
	}

	private processCurrentPrice(data: any[]) {
		this.coinLatestInfo = new Map(data.map((coin) => [coin.market, coin]));
		this.krwCoinInfo = data.filter((coin) => coin.market.startsWith('KRW'));
		this.logger.log(`Updated current prices`);
	}

	private processOrderBook(data: any[]) {
		this.orderbookLatestInfo = new Map(data.map((coin) => [coin.market, coin]));
		this.logger.log(`Updated order book`);
	}

	private scheduleNextUpdate(
		key: keyof typeof this.timeouts,
		interval: number,
		callback: () => void,
	) {
		if (this.timeouts[key]) clearTimeout(this.timeouts[key]);
		this.timeouts[key] = setTimeout(callback, interval);
	}

	private async ensureCoinCodeListIsLoaded() {
		const maxAttempts = 50; // Prevent infinite waiting
		let attempts = 0;

		while (this.coinCodeList.length <= 1 && attempts < maxAttempts) {
			await new Promise((resolve) => setTimeout(resolve, 100));
			attempts++;
		}

		if (attempts === maxAttempts) {
			this.logger.warn('Coin code list loading timed out');
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

	getCoinOrderbookByBid(buyDto: { typeGiven: string; typeReceived: string }) {
		const { typeGiven, typeReceived } = buyDto;
		const code = `${typeGiven}-${typeReceived}`;
		return this.orderbookLatestInfo.get(code)?.orderbook_units || [];
	}
	getCoinOrderbookByAsk(buyDto: { typeGiven: string; typeReceived: string }) {
		const { typeGiven, typeReceived } = buyDto;
		const code = `${typeReceived}-${typeGiven}`;
		return this.orderbookLatestInfo.get(code)?.orderbook_units || [];
	}

	async searchCoinData(data: string) {
		const searchTerm = data.toLowerCase();
    if(data===''){
      return {
        statusCode : 200,
        result : []
      }
    }
    const results = await Promise.all(
      this.coinRawList.map(async (coin) => {
        if ((coin.market.toLowerCase().includes(searchTerm) ||
            coin.korean_name.toLowerCase().includes(searchTerm) ||
            coin.english_name.toLowerCase().includes(searchTerm)) && 
            coin.market.includes("KRW")){
            coin.image_url = UPBIT_IMAGE_URL + coin.market.split('-')[1] + '.png';
            return coin;
        }
      })
    );
  
    return {
      statusCode : 200,
      result : results.filter(result => result !== undefined)
    }
	}
}
