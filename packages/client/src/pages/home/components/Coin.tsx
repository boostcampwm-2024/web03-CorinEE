import { MarketData } from '@/types/market';
import { Change, SSEDataType } from '@/types/ticker';
import { Formatters } from '@/utility/format/formatSSEData';
import Heart from '@asset/heart.svg?react';
import { useNavigate } from 'react-router-dom';
import colorClasses from '@/constants/priceColor';
import useRecentlyMarketStore from '@/store/recentlyViewed';
import { QueryClient } from '@tanstack/react-query';

type CoinProps = {
	formatters: Formatters;
	market: MarketData;
	sseData: SSEDataType;
};

function Coin({ formatters, market, sseData }: CoinProps) {
	const navigate = useNavigate();
	const queryClient = new QueryClient();
	const { addRecentlyViewedMarket } = useRecentlyMarketStore();
	const handleClick = () => {
		addRecentlyViewedMarket(market.market);
		console.log(market);
		navigate(`/trade/KRW-${market.market.split('-')[1]}`);
		queryClient.invalidateQueries({ queryKey: ['recentlyMarketList'] });
	};
	const change: Change = sseData[market.market]?.change;

	const trade_price = formatters.formatTradePrice(
		sseData[market.market]?.trade_price,
	);
	const change_rate = formatters.formatChangeRate(
		sseData[market.market]?.signed_change_rate,
		change,
	);
	const change_price = formatters.formatSignedChangePrice(
		sseData[market.market]?.signed_change_price,
		change,
	);
	const acc_trade_price_24h = formatters.formatAccTradePrice(
		sseData[market.market]?.acc_trade_price_24h,
	);

	return (
		<div className="flex items-center py-1 border-b border-solid border-gray-300 cursor-pointer hover:bg-gray-100">
			<div className="fill-blue-gray-100 flex-[1] flex w-5 h-5 hover:fill-red-400">
				<Heart />
			</div>

			<div className="flex flex-[24] items-center" onClick={handleClick}>
				<div className="flex items-center gap-2 flex-[6]">
					<img
						className="w-7 h-7"
						src={`https://static.upbit.com/logos/${market.market.split('-')[1]}.png`}
					/>
					<div className="flex flex-col">
						<p>{market.korean_name}</p>
						<p className="text-gray-700 text-xs">{market.market}</p>
					</div>
				</div>

				<div className={`flex-[6] ${colorClasses[change]}`}>{trade_price}</div>
				<div className="flex-[6]">
					<div className={colorClasses[change]}>
						<span className="block">
							{change_price} {change_rate}
						</span>
					</div>
				</div>
				<div className="flex-[6]">{acc_trade_price_24h}</div>
			</div>
		</div>
	);
}

export default Coin;
