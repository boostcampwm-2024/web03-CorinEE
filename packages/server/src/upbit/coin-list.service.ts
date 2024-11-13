import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
<<<<<<< HEAD
import { UPBIT_IMAGE_URL, UPBIT_RESTAPI_URL } from 'common/upbit';
<<<<<<< HEAD
import { CoinTickerDto } from './dtos/coin-ticker.dto';
<<<<<<< HEAD
<<<<<<< HEAD
=======
import { plainToInstance } from 'class-transformer';
>>>>>>> 78d154c (feat: coinTickerDTO)
=======
>>>>>>> 6f58c58 (chore: 배포용 commit)
=======
=======
import { UPBIT_CURRENT_PRICE_URL, UPBIT_IMAGE_URL, UPBIT_RESTAPI_URL } from 'common/upbit';
>>>>>>> e7b2eae (feat: 실시간 거래량 top20 코인 종목 api)
import { UPBIT_UPDATED_COIN_INFO_TIME } from 'common/upbit';
>>>>>>> 5dfd209 (feat: 코인 종목 api, 호가창 websocket 연결)

@Injectable()
export class CoinListService implements OnModuleInit {
	private coinRawList: any;
	private coinCodeList: string[] = ["KRW-BTC"];
	private coinNameList: Map<string, string>;
	private timeoutId: NodeJS.Timeout | null = null;
	private coinLatestInfo = new Map();
	private krwCoinInfo;

	onModuleInit() {
		this.updateCoinList();
		this.updateCoinCurrentPrice();
	}
	
	constructor(private readonly httpService: HttpService) {}

	async updateCoinList() {
		try{
			const response = await firstValueFrom(
				this.httpService.get(UPBIT_RESTAPI_URL),
			);
			this.coinCodeList = response.data.map((coin) => coin.market);
			this.coinNameList = new Map(
				response.data.map((coin) => [coin.market, coin.korean_name]),
			);
			this.coinRawList = response.data
		}catch(error){
			console.error('getCoinListFromUpbit error:', error);
		}finally{
			console.log(`코인 목록 최신화: ${Date()}`);
			if (this.timeoutId) clearTimeout(this.timeoutId);
			this.timeoutId = setTimeout(()=>this.updateCoinList(),UPBIT_UPDATED_COIN_INFO_TIME)
		}
	}
	
	async updateCoinCurrentPrice(){
		try{
			while(this.coinCodeList.length === 1) await new Promise(resolve => setTimeout(resolve, 100));
			const response = await firstValueFrom(
				this.httpService.get(`${UPBIT_CURRENT_PRICE_URL}markets=${this.coinCodeList.join(',')}`),
			);
			this.coinLatestInfo = new Map(response.data.map((coin) => [coin.market, coin]));
			this.krwCoinInfo = response.data.filter((coin) => coin.market.startsWith("KRW"))
		}catch(error){
			console.error('getCoinListFromUpbit error:', error);
		}finally{
			console.log(`코인 정보 최신화: ${Date()}`);
			if (this.timeoutId) clearTimeout(this.timeoutId);
			this.timeoutId = setTimeout(()=>this.updateCoinCurrentPrice(),UPBIT_UPDATED_COIN_INFO_TIME)
		}
	}
	
	async getMostTradeCoin(){
		while(this.krwCoinInfo === undefined) await new Promise(resolve => setTimeout(resolve, 100));
		return this.krwCoinInfo.sort((a, b) => b.acc_trade_price_24h - a.acc_trade_price_24h)
					.slice(0, 20)
					.map((coin)=>{
						coin.code = coin.market
						this.coinAddNameAndUrl(coin)
						return{
							code: coin.code,
							image_url: coin.image_url,
							korean_name: coin.korean_name,
						};
					})
	}
	getCoinNameList(){
		return this.coinCodeList;
	}
	getAllCoinList(){
		return this.coinRawList;
	}
	getKRWCoinList(){
		return this.coinRawList.filter((coin) => coin.market.startsWith("KRW"))
	}
	getBTCCoinList(){
		return this.coinRawList.filter((coin)=>coin.market.startsWith("BTC"))
	}
	getUSDTCoinList(){
		return this.coinRawList.filter((coin) => coin.market.startsWith("USDT"))
	}
	coinAddNameAndUrl = (message) => {
		message.korean_name = this.coinNameList.get(message.code);
		message.image_url = this.getCoinImageURL(message.code);

		return message;
	}
<<<<<<< HEAD
<<<<<<< HEAD
	convertToTickerDTO = (message: string) => {
		const data = JSON.parse(message);
<<<<<<< HEAD
    return {
      name: this.coinNameList.get(data.code),
      code: data.code,
      coin_img_url: this.getCoinImageURL(data.code),
      signed_change_price: data.signed_change_price,
      opening_price: data.opening_price,
      signed_change_rate: data.signed_change_rate,
      trade_price: data.trade_price,
    }
<<<<<<< HEAD
<<<<<<< HEAD
=======
    return coinTicker
>>>>>>> 78d154c (feat: coinTickerDTO)
=======
>>>>>>> 6f58c58 (chore: 배포용 commit)
=======
=======
=======
	orderbookDto = (message)=>{
		const beforeTopPrice = this.coinLatestInfo.get(message.code).prev_closing_price
		
		message.korean_name = this.coinNameList.get(message.code);
		message.image_url = this.getCoinImageURL(message.code);
		
		// 비율에 + 또는 - 기호 추가
		message.orderbook_units.map((unit)=>{
			const askRateChange = ((unit.ask_price - beforeTopPrice) / beforeTopPrice) * 100;
			const bidRateChange = ((unit.bid_price - beforeTopPrice) / beforeTopPrice) * 100;

			unit.ask_rate = (askRateChange >= 0 ? `+${askRateChange.toFixed(2)}` : `${askRateChange.toFixed(2)}`) + '%';
			unit.bid_rate = (bidRateChange >= 0 ? `+${bidRateChange.toFixed(2)}` : `${bidRateChange.toFixed(2)}`) + '%';
		})
		
		return message;
	}
>>>>>>> f2f944a (feat: 호가창 api 전일대비값 추가)
	convertToTickerDTO = (message) => {
		const data = message;
>>>>>>> ec14ae2 (fix: 배포용 hotfix)
		return {
			korean_name: this.coinNameList.get(data.code),
			code: data.code,
			coin_img_url: this.getCoinImageURL(data.code),
			signed_change_price: data.signed_change_price,
			opening_price: data.opening_price,
			signed_change_rate: data.signed_change_rate,
			trade_price: data.trade_price,
		}
>>>>>>> e8c220f (refactor: sse 구조 리팩토링)
	}
	private getCoinImageURL(code: string) {
		const logoName = code.split('-')[1];
<<<<<<< HEAD
<<<<<<< HEAD
		return `${UPBIT_IMAGE_URL}${logoName}.png`;
=======
		return UPBIT_IMAGE_URL + `${logoName}.png`;
>>>>>>> 78d154c (feat: coinTickerDTO)
=======
		return `${UPBIT_IMAGE_URL}${logoName}.png`;
>>>>>>> 6f58c58 (chore: 배포용 commit)
	}
}