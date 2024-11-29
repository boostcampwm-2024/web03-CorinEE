import { Injectable } from '@nestjs/common';
import { Coin, CurrentPrice, Evaluation } from './dtos/asset.interface';

@Injectable()
export class AssetService {
	constructor() {}

	calculateEvaluations(
		coins: Coin[],
		currentPrices: CurrentPrice[],
	): Evaluation[] {
		return coins.map((coin) => {
			const currentPriceData = currentPrices.find(
				(price) => price.code === coin.code,
			);
			if (!currentPriceData) {
				throw new Error(`현재가 데이터가 없습니다: ${coin.code}`);
			}

			const evaluationAmount = currentPriceData.trade_price * coin.quantity;
			const profitLoss =
				(currentPriceData.trade_price - coin.avg_purchase_price) *
				coin.quantity;
			const profitLossRate =
				((currentPriceData.trade_price - coin.avg_purchase_price) /
					coin.avg_purchase_price) *
				100;

			return {
				code: coin.code,
				avg_purchase_price: coin.avg_purchase_price,
				trade_price: currentPriceData.trade_price,
				quantity: coin.quantity,
				evaluation_amount: evaluationAmount,
				profit_loss: profitLoss,
				profit_loss_rate: profitLossRate,
			};
		});
	}
}
