import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { UPBIT_IMAGE_URL, UPBIT_RESTAPI_URL } from 'common/upbit';
import { UPBIT_UPDATED_COIN_INFO_TIME } from 'common/upbit';

@Injectable()
export class CoinListService{
	private coinRawList: any;
	private coinCodeList: string[] = ["KRW-BTC"];
	private coinNameList: Map<string, string>;
	private timeoutId: NodeJS.Timeout | null = null;
	
	constructor(private readonly httpService: HttpService) {
		this.getCoinListFromUpbit();
	}

	async getCoinListFromUpbit() {
		try{
			const response = await firstValueFrom(
				this.httpService.get(UPBIT_RESTAPI_URL),
			);
			this.coinRawList = response.data;
			this.coinCodeList = response.data.map((coin) => coin.market);
			this.coinNameList = new Map(
				response.data.map((coin) => [coin.market, coin.korean_name]),
			);

		}catch(error){
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
	tempCoinAddNameAndUrl(message) {
		message.name = this.coinNameList.get(message.code);
		message.coin_img_url = this.getCoinImageURL(message.code);

		return message;
	}
	convertToTickerDTO = (message) => {
		const data = message;
		return {
			name: this.coinNameList.get(data.code),
			code: data.code,
			coin_img_url: this.getCoinImageURL(data.code),
			signed_change_price: data.signed_change_price,
			opening_price: data.opening_price,
			signed_change_rate: data.signed_change_rate,
			trade_price: data.trade_price,
		}
	}
	private getCoinImageURL(code: string) {
		const logoName = code.split('-')[1];
		return `${UPBIT_IMAGE_URL}${logoName}.png`;
	}
}