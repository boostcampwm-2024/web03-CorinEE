import { MarketData } from '@/types/market';
import { Change, SSEDataType } from '@/types/ticker';
import { Formatters } from '@/utility/format/formatSSEData';
import Heart from '@asset/heart.svg?react';
import { useNavigate } from 'react-router-dom';
import colorClasses from '@/constants/priceColor';
import useRecentlyMarketStore from '@/store/recentlyViewed';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { useHandleToggle } from '@/hooks/interest/useHandleToggle';

type CoinProps = {
	formatters: Formatters;
	market: MarketData;
	sseData: SSEDataType;
	isInterest: boolean | undefined;
};

function Coin({ formatters, market, sseData, isInterest }: CoinProps) {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { handleToggle } = useHandleToggle();
	const { addRecentlyViewedMarket } = useRecentlyMarketStore();

	const handleClick = () => {
		addRecentlyViewedMarket(market.market);
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
		<tr className="border-b h-14 border-solid border-gray-300 hover:bg-gray-100">
			<td className="w-12 align-middle">
				<button
					className={`inline-flex justify-center ${!isInterest || !isAuthenticated ? 'fill-blue-gray-100' : 'fill-red-500'}`}
					onClick={(e) => {
						e.stopPropagation();
						handleToggle(market.market);
					}}
				>
					<Heart className="w-6 h-6" />
				</button>
			</td>

			<td className="w-2/12 align-middle" onClick={handleClick}>
				<div className="flex items-center gap-2">
					<img
						className="w-7 h-7"
						src={`https://static.upbit.com/logos/${market.market.split('-')[1]}.png`}
						alt={market.korean_name}
					/>
					<div>
						<p>{market.korean_name}</p>
						<p className="text-gray-700 text-xs">{market.market}</p>
					</div>
				</div>
			</td>

			<td
				className={`w-2/12 text-right align-middle ${colorClasses[change]}`}
				onClick={handleClick}
			>
				{trade_price}
			</td>

			<td className="w-4/12 text-right align-middle" onClick={handleClick}>
				<span className={`block ${colorClasses[change]}`}>
					{change_price} {change_rate}
				</span>
			</td>

			<td className="text-right align-middle" onClick={handleClick}>
				{acc_trade_price_24h}
			</td>
		</tr>
	);
}

export default Coin;
