import { BalanceMarket } from '@/types/market';
import { Change, SSEDataType } from '@/types/ticker';

const PORTFOLIO_EVALUATOR = {
	evaluateTotalPrice(balanceMarketList: BalanceMarket[], sseData: SSEDataType) {
		const totalEvaluation = balanceMarketList.reduce((acc, market) => {
			return Math.floor(
				acc + market.quantity * sseData[market.market].trade_price,
			);
		}, 0);
		return totalEvaluation;
	},

	evaluatePerPrice(coinQuantity: number, tradePrice: number) {
		return Math.floor(tradePrice * coinQuantity);
	},

  calculateProfitPrice(evaluationPrice:number, bid:number){
    return evaluationPrice - bid
  },

	calculateProfitRate(evaluationPrice: number, bid: number) {
		return ((evaluationPrice - bid) / bid) * 100;
	},

	getChangeStatus(profitRate: number): Change {
		return profitRate === 0 ? 'EVEN' : profitRate > 0 ? 'RISE' : 'FALL';
	},
};

export default PORTFOLIO_EVALUATOR;
