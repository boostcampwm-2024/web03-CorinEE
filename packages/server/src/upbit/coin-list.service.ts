import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
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
import { UPBIT_UPDATED_COIN_INFO_TIME } from 'common/upbit';
>>>>>>> 5dfd209 (feat: 코인 종목 api, 호가창 websocket 연결)

@Injectable()
export class CoinListService implements OnModuleInit {
	private coinRawList: any;
	private coinCodeList: string[] = ["KRW-BTC"];
	private coinNameList: Map<string, string>;
	private timeoutId: NodeJS.Timeout | null = null;
	
	onModuleInit() {
		this.getCoinListFromUpbit();
	}
	
	constructor(private readonly httpService: HttpService) {}

	async getCoinListFromUpbit() {
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
			console.log(`코인 정보 최신화: ${Date()}`);
			if (this.timeoutId) clearTimeout(this.timeoutId);
			this.timeoutId = setTimeout(()=>this.getCoinListFromUpbit(),UPBIT_UPDATED_COIN_INFO_TIME)
		}
	}
	getCoinNameList(){
		return this.coinCodeList;
	}
	getAllCoinList(){
		return this.coinRawList.map((coin) => this.coinAddNameAndUrl(coin));
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
		message.name = this.coinNameList.get(message.code);
		message.coin_img_url = this.getCoinImageURL(message.code);

		return message;
	}
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
	convertToTickerDTO = (message) => {
		const data = message;
>>>>>>> ec14ae2 (fix: 배포용 hotfix)
		return {
			name: this.coinNameList.get(data.code),
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