import { useWSTicker } from '@/hooks/useWSTicker';
import Coin from '@/pages/home/components/Coin';
import { MarketData } from '@/types/market';
import { MarketCategory } from '@/types/menu';
import { formatData } from '@/utility/formatData';

type CoinListProps = {
	markets: MarketData[];
	activeCategory: MarketCategory;
};

function CoinList({ markets, activeCategory }: CoinListProps) {
	const { socketData } = useWSTicker(markets);
	const formatters = formatData(activeCategory);
	if (!socketData) return;

	return (
		<div className="w-[90%]">
			<ul className="flex py-4 border-b border-solid border-gray-300 text-gray-700  bg-white">
				<li className="flex-[1]">관심</li>
				<li className="flex-[6]">한글명</li>
				<li className="flex-[6]">현재가</li>
				<li className="flex-[6]">전일대비</li>
				<li className="flex-[6]">거래대금</li>
			</ul>

			{markets.map((market) => (
				<Coin
					key={market.market}
					formatters={formatters}
					market={market}
					socketData={socketData}
				/>
			))}
		</div>
	);
}

export default CoinList;
