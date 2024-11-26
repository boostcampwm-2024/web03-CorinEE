import { AccountCoin } from '@/types/account';
interface ProfitInfo {
	profitRate: string;
	expectedProfit: string;
	isProfitable: boolean;
}

export const calculateProfitInfo = (
	currentPrice: number,
	quantity: number,
	targetCoin: AccountCoin,
): ProfitInfo => {
	const { averagePrice } = targetCoin;
	const totalBuyAmount = averagePrice * quantity;
	const expectedSellAmount = currentPrice * quantity;
	const rawProfit = expectedSellAmount - totalBuyAmount;

	const profitRate = ((currentPrice - averagePrice) / averagePrice) * 100;
	const isProfitable = profitRate > 0;

	const formattedProfitRate = `${isProfitable ? '+' : ''}${profitRate.toFixed(2)}`;
	const formattedProfit = `${isProfitable ? '+' : ''}${Math.floor(rawProfit).toLocaleString()}`;

	return {
		profitRate: formattedProfitRate,
		expectedProfit: formattedProfit,
		isProfitable,
	};
};
