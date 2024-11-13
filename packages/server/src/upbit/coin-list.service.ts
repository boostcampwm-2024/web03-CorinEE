import { Injectable, OnModuleInit } from '@nestjs/common';
import {
	UPBIT_IMAGE_URL,
} from 'common/upbit';
import { CoinDataUpdaterService } from './coin-data-updater.service';

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

		return message;
	};

	convertToTickerDTO = (message) => {
		const data = message;
		return {
			korean_name: this.coinDataUpdaterService.getCoinNameList().get(data.code),
			code: data.code,
			coin_img_url: this.getCoinImageURL(data.code),
			signed_change_price: data.signed_change_price,
			opening_price: data.opening_price,
			signed_change_rate: data.signed_change_rate,
			trade_price: data.trade_price,
		};
	};

	private getCoinImageURL(code: string) {
		const logoName = code.split('-')[1];
		return `${UPBIT_IMAGE_URL}${logoName}.png`;
	}
}
