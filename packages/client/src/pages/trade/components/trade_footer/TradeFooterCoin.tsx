import { useNavigate } from 'react-router-dom';
import useRecentlyMarketStore from '@/store/recentlyViewed';
import { useQueryClient } from '@tanstack/react-query';
import { SidebarMarketData } from '@/types/market';
import { formatData } from '@/utility/format/formatSSEData';
import { Change, CoinTicker } from '@/types/ticker';
import colorClasses from '@/constants/priceColor';
type TradeFooterCoinProps = {
	coin: SidebarMarketData;
	ticker: CoinTicker[];
};

function TradeFooterCoin({ coin, ticker }: TradeFooterCoinProps) {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { addRecentlyViewedMarket } = useRecentlyMarketStore();
	const formatters = formatData('KRW');

	const handleClick = (market: string) => {
		addRecentlyViewedMarket(market);
		navigate(`/trade/${market}`);
		queryClient.invalidateQueries({ queryKey: ['recentlyMarketList'] });
	};

	const filterTicker = ticker.filter((t) => t.code === coin.market);

	const change: Change = filterTicker[0]?.change;
	const trade_prcie = formatters.formatTradePrice(filterTicker[0]?.trade_price);
	const change_rate = formatters.formatChangeRate(
		filterTicker[0]?.signed_change_rate,
		change,
	);
	const change_price = formatters.formatSignedChangePrice(
		filterTicker[0]?.signed_change_price,
		change,
	);

	return (
		<div
			onClick={() => handleClick(coin.market)}
			className="flex items-center shrink-0 p-2 mr-4 cursor-pointer rounded-md hover:bg-gray-200"
		>
			<img
				className="w-6 h-6 mr-2"
				src={coin.image_url}
				alt={coin.korean_name}
			/>
			<div className="flex gap-1">
				<span className="whitespace-nowrap text-sm text-gray-900">
					{coin.korean_name}
				</span>
				<span className="text-sm">{trade_prcie}</span>
				<span className={`text-sm ${colorClasses[change]}`}>
					{change_price}
				</span>
				<span className={`text-sm ${colorClasses[change]}`}>{change_rate}</span>
			</div>
		</div>
	);
}

export default TradeFooterCoin;
