import { useAllUserInvestment } from '@/hooks/account/useAllUserInvestment';
import RankingHeader from '@/pages/ranked/RankingHeader';
import RankingTableHeader from '@/pages/ranked/RankingTableHeader';
import RankingTableRow from '@/pages/ranked/RankingTableRow';
import { calculateRanking } from '@/utility/finance/calculateRanking';

function RankedList() {
	const { data } = useAllUserInvestment();
	const rankedList = calculateRanking(data);

	return (
		<div className="flex flex-col items-center just">
			<RankingHeader title="랭킹" subtitle="실시간 사용자 랭킹" />
			<table className="w-full">
				<RankingTableHeader />
				<tbody>
					{rankedList.map((user, index) => (
						<RankingTableRow
							key={user.id}
							username={user.username}
							totalAsset={user.totalAsset}
							investmentRatio={user.investmentRatio}
							totalProfitLoss={user.totalProfitLoss}
							profitRate={user.profitRate}
							index={index}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default RankedList;
