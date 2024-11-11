import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { UPBIT_IMAGE_URL, UPBIT_RESTAPI_URL } from 'common/upbit';
import { CoinTickerDto } from './dtos/coin-ticker.dto';
<<<<<<< HEAD
=======
import { plainToInstance } from 'class-transformer';
>>>>>>> 78d154c (feat: coinTickerDTO)

@Injectable()
export class CoinListService {
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
	getCoinList(coins) {
		return this.coinCodeList.filter((coin) => coins.includes(coin));
	}
  
  tempCoinAddNameAndUrl(message: string) {
    const data = JSON.parse(message);
    data.name = this.coinNameList.get(data.code);
    data.coin_img_url = this.getCoinImageURL(data.code);

    return data;
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
<<<<<<< HEAD
=======
    return coinTicker
>>>>>>> 78d154c (feat: coinTickerDTO)
	}

	private getCoinImageURL(code: string) {
		const logoName = code.split('-')[1];
<<<<<<< HEAD
		return `${UPBIT_IMAGE_URL}${logoName}.png`;
=======
		return UPBIT_IMAGE_URL + `${logoName}.png`;
>>>>>>> 78d154c (feat: coinTickerDTO)
	}
}