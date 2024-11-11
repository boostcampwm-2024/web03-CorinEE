import { useWSTicker } from '@/hooks/useWSTicker';
import Coin from '@/pages/home/components/Coin';
import ScrollPageButton from '@/pages/home/components/ScrollPageButton';
import { MarketData } from '@/types/market';
import { MarketCategory } from '@/types/menu';
import { formatData } from '@/utility/formatData';
import { useEffect, useState } from 'react';

type CoinListProps = {
	markets: MarketData[];
	activeCategory: MarketCategory;
};

function CoinList({ markets, activeCategory }: CoinListProps) {
	const { socketData } = useWSTicker(markets);
	const [currentScrollPage, setCurrentScrollPage] = useState(1);
	const COINS_PER_PAGE = 10;
	const maxScrollPage = Math.ceil(markets.length / COINS_PER_PAGE);

	useEffect(() => {
		setCurrentScrollPage(1);
	}, [activeCategory]);

	const formatters = formatData(activeCategory);
	if (!socketData) return;

	const handleScrollPage = (pageNumber: number) => {
		setCurrentScrollPage(pageNumber);
	};

	return (
		<div className="w-[90%]">
			<ul className="flex py-4 border-b border-solid border-gray-300 text-gray-700  bg-white">
				<li className="flex-[1]">관심</li>
				<li className="flex-[6]">한글명</li>
				<li className="flex-[6]">현재가</li>
				<li className="flex-[6]">전일대비</li>
				<li className="flex-[6]">거래대금</li>
			</ul>

			{markets
				.slice(
					COINS_PER_PAGE * (currentScrollPage - 1),
					COINS_PER_PAGE * currentScrollPage,
				)
				.map((market) => (
					<Coin
						key={market.market}
						formatters={formatters}
						market={market}
						socketData={socketData}
					/>
				))}

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
