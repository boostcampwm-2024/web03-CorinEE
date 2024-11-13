import { Injectable, OnModuleInit } from '@nestjs/common';
<<<<<<< HEAD
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
=======
import {
	UPBIT_IMAGE_URL,
} from 'common/upbit';
import { CoinDataUpdaterService } from './coin-data-updater.service';
>>>>>>> c7d67b3 (feat: coin-list.sevice 분리)

@Injectable()
export class CoinListService implements OnModuleInit {
	constructor(
		private readonly coinDataUpdaterService: CoinDataUpdaterService,
	) {}

	onModuleInit() {
		this.coinDataUpdaterService.updateCoinList();
		this.coinDataUpdaterService.updateCoinCurrentPrice();
	}

	async getMostTradeCoin() {
    const krwCoinInfo = this.coinDataUpdaterService.getKrwCoinInfo();
    while (!krwCoinInfo) await new Promise(resolve => setTimeout(resolve, 100));
    return krwCoinInfo.sort((a, b) => b.acc_trade_price_24h - a.acc_trade_price_24h)
      .slice(0, 20)
      .map((coin) => {
        coin.code = coin.market;
        this.coinAddNameAndUrl(coin);
        return {
          code: coin.code,
          image_url: coin.image_url,
          korean_name: coin.korean_name,
        };
      });
  }
	getCoinNameList() {
    return this.coinDataUpdaterService.getCoinCodeList();
  }

  getAllCoinList() {
    return this.coinDataUpdaterService.getAllCoinList();
  }

  getKRWCoinList() {
    return this.coinDataUpdaterService.getAllCoinList().filter((coin) => coin.market.startsWith("KRW"));
  }

  getBTCCoinList() {
    return this.coinDataUpdaterService.getAllCoinList().filter((coin) => coin.market.startsWith("BTC"));
  }

  getUSDTCoinList() {
    return this.coinDataUpdaterService.getAllCoinList().filter((coin) => coin.market.startsWith("USDT"));
  }

	coinAddNameAndUrl(coin) {
    coin.korean_name = this.coinDataUpdaterService.getCoinNameList().get(coin.code);
    coin.image_url = this.getCoinImageURL(coin.code);
    return coin;
  }
	
	orderbookDto = (message) => {
		const beforeTopPrice = this.coinDataUpdaterService.getCoinLatestInfo().get(
			message.code,
		).prev_closing_price;

		message.korean_name = this.coinDataUpdaterService.getCoinNameList().get(message.code);
		message.image_url = this.getCoinImageURL(message.code);

<<<<<<< HEAD
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
=======
		message.orderbook_units.map((unit) => {
			const askRateChange =
				((unit.ask_price - beforeTopPrice) / beforeTopPrice) * 100;
			const bidRateChange =
				((unit.bid_price - beforeTopPrice) / beforeTopPrice) * 100;

			unit.ask_rate =
				(askRateChange >= 0
					? `+${askRateChange.toFixed(2)}`
					: `${askRateChange.toFixed(2)}`) + '%';
			unit.bid_rate =
				(bidRateChange >= 0
					? `+${bidRateChange.toFixed(2)}`
					: `${bidRateChange.toFixed(2)}`) + '%';
		});
>>>>>>> c7d67b3 (feat: coin-list.sevice 분리)

		return message;
<<<<<<< HEAD
	}
>>>>>>> f2f944a (feat: 호가창 api 전일대비값 추가)
=======
	};

>>>>>>> c7d67b3 (feat: coin-list.sevice 분리)
	convertToTickerDTO = (message) => {
		const data = message;
>>>>>>> ec14ae2 (fix: 배포용 hotfix)
		return {
			korean_name: this.coinDataUpdaterService.getCoinNameList().get(data.code),
			code: data.code,
			coin_img_url: this.getCoinImageURL(data.code),
			signed_change_price: data.signed_change_price,
			opening_price: data.opening_price,
			signed_change_rate: data.signed_change_rate,
			trade_price: data.trade_price,
<<<<<<< HEAD
		}
>>>>>>> e8c220f (refactor: sse 구조 리팩토링)
	}
=======
		};
	};

>>>>>>> c7d67b3 (feat: coin-list.sevice 분리)
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
