import { useMarketTop20 } from '@/hooks/market/useMarketTop20';
import { useNavigate } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import useRecentlyMarketStore from '@/store/recentlyViewed';

function TradeFooter() {
	const queryClient = new QueryClient();
	const { data: coins } = useMarketTop20();
	const { addRecentlyViewedMarket } = useRecentlyMarketStore();
	const navigate = useNavigate();
	const duplicatedCoins = coins ? [...coins, ...coins, ...coins, ...coins] : [];

	const handleClick = (market: string) => {
		addRecentlyViewedMarket(market);
		navigate(`/trade/${market}`);
		queryClient.invalidateQueries({ queryKey: ['recentlyMarketList'] });
	};
	return (
		<div className="absolute bottom-0 w-full bg-white overflow-hidden">
			<div className="inline-flex relative">
				<div className="flex items-center whitespace-nowrap animate-infiniteScroll">
					{duplicatedCoins?.map((coin, index) => (
						<div
							onClick={() => handleClick(coin.market)}
							key={`${coin.market}-${index}`}
							className="flex items-center shrink-0 p-2 mr-4 cursor-pointer rounded-md hover:bg-gray-200"
						>
							<img
								className="w-6 h-6 mr-2"
								src={coin.image_url}
								alt={coin.korean_name}
							/>
							<span className="whitespace-nowrap text-sm">
								{coin.korean_name}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default TradeFooter;
