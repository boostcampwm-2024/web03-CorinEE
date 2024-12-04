import { useSSETicker } from '@/hooks/SSE/useSSETicker';
import Coin from '@/pages/home/components/Coin';
import ScrollPageButton from '@/pages/home/components/ScrollPageButton';
import { MarketData } from '@/types/market';
import { MarketCategory } from '@/types/category';
import { formatData } from '@/utility/format/formatSSEData';
import { useEffect, useMemo, useState } from 'react';
import { useMyInterest } from '@/hooks/interest/useMyInterest';
import { PER_PAGE } from '@/constants/pagination';

type CoinListProps = {
	markets: MarketData[];
	activeCategory: MarketCategory;
};

function CoinList({ markets, activeCategory }: CoinListProps) {
	const [currentScrollPage, setCurrentScrollPage] = useState(1);
	const maxScrollPage = Math.ceil(markets.length / PER_PAGE);
	const { isLoading, data: interestMarkets } = useMyInterest();

	const currentPageMarkets = useMemo(
		() =>
			markets.slice(
				PER_PAGE * (currentScrollPage - 1),
				PER_PAGE * currentScrollPage,
			),
		[currentScrollPage, activeCategory],
	);

	const checkInterest = (market: MarketData) => {
		return interestMarkets?.some(
			(interestMarket) => interestMarket.assetName === market.market,
		);
	};

	useEffect(() => {
		setCurrentScrollPage(1);
	}, [activeCategory]);

	const { sseData } = useSSETicker(markets);
	const formatters = formatData(activeCategory);
	const handleScrollPage = (pageNumber: number) => {
		setCurrentScrollPage(pageNumber);
	};

	if (!sseData || isLoading) return;
	return (
		<div className="mt-3">
			<table className="w-full">
				<thead className="border-b border-solid border-gray-300 text-gray-700  bg-white">
					<th className="text-left">관심</th>
					<th className="text-left"></th>
					<th className="text-right">현재가</th>
					<th className="text-right">전일대비</th>
					<th className="text-right">거래대금</th>
				</thead>
				<tbody>
					{currentPageMarkets.map((market) => (
						<Coin
							key={market.market}
							formatters={formatters}
							market={market}
							sseData={sseData}
							isInterest={checkInterest(market)}
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

export default CoinList;
