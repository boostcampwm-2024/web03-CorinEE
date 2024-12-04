import { UserInvestment } from '@/types/account';
import { formatUserName } from '@/utility/format/formatUserName';

export function calculateRanking(data: UserInvestment[]) {
	if (!data) return [];
	const INITIAL_INVESTMENT = 30000000;
	const rankedList = data
		.map((user) => {
			const totalProfitLoss = user.totalAsset - INITIAL_INVESTMENT;

			const totalInvestment = user.coinEvaluations.reduce(
				(sum, coin) => sum + coin.avg_purchase_price * coin.quantity,
				0,
			);
			const investmentRatio =
				totalInvestment > 0
					? ((user.totalAsset - user.KRW) / user.totalAsset) * 100
					: 0;
			const profitRate = (totalProfitLoss / INITIAL_INVESTMENT) * 100;

			console.table({
				id: user.id,
				username: formatUserName(user.username),
				totalAsset: user.totalAsset,
				totalProfitLoss,
				profitRate,
				investmentRatio,
			});

			return {
				id: user.id,
				username: formatUserName(user.username),
				totalAsset: user.totalAsset,
				totalProfitLoss,
				profitRate,
				investmentRatio,
			};
		})
		.sort((a, b) => b.totalAsset - a.totalAsset);

	return rankedList;
}
