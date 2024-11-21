import { BalanceMarket } from '@/types/market';
import { Change, SSEDataType } from '@/types/ticker';

const PORTFOLIO_EVALUATOR = {
	evaluateTotalPrice(
		balanceMarketList: BalanceMarket[],
		sseData: SSEDataType | null | undefined,
	) {
		if (!sseData) return 0;
		const totalEvaluation = balanceMarketList.reduce((acc, market) => {
			return Math.floor(
				acc + market.quantity * sseData[market.market].trade_price,
			);
		}, 0);
		return totalEvaluation;
	},

	evaluatePerPrice(coinQuantity: number, tradePrice: number) {
		return tradePrice * coinQuantity;
	},

	calculateProfitPrice(evaluationPrice: number, bid: number) {
		return evaluationPrice - bid;
	},

	calculateProfitRate(evaluationPrice: number, bid: number) {
		return Number((((evaluationPrice - bid) / bid) * 100).toFixed(3));;
	},

	getChangeStatus(profitRate: number): Change {
		return profitRate === 0 ? 'EVEN' : profitRate > 0 ? 'RISE' : 'FALL';
	},
};

export default PORTFOLIO_EVALUATOR;
