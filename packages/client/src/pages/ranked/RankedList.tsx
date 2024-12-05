import { PER_PAGE } from '@/constants/pagination';
import { useAllUserInvestment } from '@/hooks/account/useAllUserInvestment';
import ScrollPageButton from '@/pages/home/components/ScrollPageButton';
import RankingHeader from '@/pages/ranked/RankingHeader';
import RankingTableHeader from '@/pages/ranked/RankingTableHeader';
import RankingTableRow from '@/pages/ranked/RankingTableRow';
import { calculateRanking } from '@/utility/finance/calculateRanking';
import { useMemo, useState } from 'react';

function RankedList() {
	const { data } = useAllUserInvestment();
	const rankedList = calculateRanking(data).slice(0,50);
	const [currentScrollPage, setCurrentScrollPage] = useState(1);
	const maxScrollPage = Math.ceil(Math.min(rankedList.length, 50) / PER_PAGE);;

	const currentPageRankedList = useMemo(
		() =>
			rankedList.slice(
				PER_PAGE * (currentScrollPage - 1),
				PER_PAGE * currentScrollPage,
			),
		[currentScrollPage],
	);

	const handleScrollPage = (pageNumber: number) => {
		setCurrentScrollPage(pageNumber);
	};

	return (
		<div className="h-full flex flex-col items-center">
			<RankingHeader title="랭킹" subtitle="실시간 사용자 Top50 랭킹 (총 자산 기준)" />
			<table className="w-full">
				<RankingTableHeader />
				<tbody>
					{currentPageRankedList.map((user, index) => (
						<RankingTableRow
							key={user.id}
							username={user.username}
							totalAsset={user.totalAsset}
							investmentRatio={user.investmentRatio}
							totalProfitLoss={user.totalProfitLoss}
							profitRate={user.profitRate}
							index={index + (currentScrollPage - 1) * PER_PAGE}
						/>
					))}
				</tbody>
			</table>
			<ol className="flex py-4 gap-4 justify-center">
				{Array.from({ length: maxScrollPage }).map((_, index) => (
					<ScrollPageButton
						key={index}
						pageNumber={index + 1}
						currentScrollPage={currentScrollPage}
						handleScrollPage={handleScrollPage}
					/>
				))}
			</ol>
		</div>
	);
}

export default RankedList;
