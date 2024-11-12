import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { UPBIT_IMAGE_URL, UPBIT_RESTAPI_URL } from 'common/upbit';
import { CoinTickerDto } from './dtos/coin-ticker.dto';

@Injectable()
export class CoinListService{
	private coinCodeList: string[];
	private coinNameList: Map<string, string>;
	constructor(private readonly httpService: HttpService) {}

	async getCoinListFromUpbit() {
		const response = await firstValueFrom(
			this.httpService.get(UPBIT_RESTAPI_URL),
		);
		this.coinCodeList = response.data.map((coin) => coin.market);
		this.coinNameList = new Map(
			response.data.map((coin) => [coin.market, coin.korean_name]),
		);
	}
	getAllCoinList(){
		return this.coinCodeList
	}
	tempCoinAddNameAndUrl(message) {
		message.name = this.coinNameList.get(message.code);
		message.coin_img_url = this.getCoinImageURL(message.code);

		return message;
	}
	convertToTickerDTO = (message: string) => {
		const data = JSON.parse(message);
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