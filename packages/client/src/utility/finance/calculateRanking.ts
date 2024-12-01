import { UserInvestment } from '@/types/account';
import { formatUserName } from '@/utility/format/formatUserName';

export function calculateRanking(data: UserInvestment[]) {
	if (!data) return [];
	const rankedList = data
		.map((user) => {
			const totalProfitLoss = user.coinEvaluations.reduce(
				(sum, coin) => sum + coin.profit_loss,
				0,
			);
			const totalInvestment = user.coinEvaluations.reduce(
				(sum, coin) => sum + coin.avg_purchase_price * coin.quantity,
				0,
			);
			const investmentRatio =
				totalInvestment > 0
					? ((user.totalAsset - user.KRW) / user.totalAsset) * 100
					: 0;
			const profitRate =
				totalInvestment > 0 ? (totalProfitLoss / totalInvestment) * 100 : 0;
			return {
				id: user.id,
				username: formatUserName(user.username),
				totalAsset: user.totalAsset,
				totalProfitLoss,
				profitRate,
				investmentRatio,
			};
		})
		.sort((a, b) => b.profitRate - a.profitRate);

	return rankedList;
}
