import { BalanceMarket } from '@/types/market';
import { Change, SSEDataType } from '@/types/ticker';

const PORTFOLIO_EVALUATOR = {
	evaluateTotalPrice(
		balanceMarketList: BalanceMarket[],
		sseData: SSEDataType | null | undefined,
	) {
		if (!sseData) return 0;
		const totalEvaluation = balanceMarketList.reduce((acc, market) => {
			if (!sseData[market.market]) return 0;

			return acc + market.quantity * sseData[market.market].trade_price;
		}, 0);
		return totalEvaluation;
	},

	evaluatePerPrice(coinQuantity: number, tradePrice: number) {
		return Math.floor(tradePrice * coinQuantity);
	},

	calculateProfitPrice(evaluationPrice: number, bid: number) {
		return evaluationPrice - bid;
	},

	calculateProfitRate(evaluationPrice: number, bid: number) {
		return ((evaluationPrice - bid) / bid) * 100;
	},

	getChangeStatus(profitRate: number): Change {
    const threshold = 0.0005; 
    
    if (Math.abs(profitRate) < threshold) {
        return 'EVEN';
    }
    return profitRate > 0 ? 'RISE' : 'FALL';
}
};

export default PORTFOLIO_EVALUATOR;
