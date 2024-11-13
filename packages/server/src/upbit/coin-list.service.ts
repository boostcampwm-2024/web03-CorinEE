import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { UPBIT_CURRENT_PRICE_URL, UPBIT_IMAGE_URL, UPBIT_RESTAPI_URL } from 'common/upbit';
import { UPBIT_UPDATED_COIN_INFO_TIME } from 'common/upbit';

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
			this.coinLatestInfo = response.data.map((coin) => [coin.market, coin])
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
	convertToTickerDTO = (message) => {
		const data = message;
		return {
			korean_name: this.coinNameList.get(data.code),
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