import { MarketData } from '@/types/market';
import { Change, SocketDataType } from '@/types/ticker';
import { Formatters } from '@/utility/formatData';
import Heart from '@asset/heart.svg?react';
import { Link } from 'react-router-dom';

type CoinProps = {
	formatters: Formatters;
	market: MarketData;
	socketData: SocketDataType;
};

function Coin({ formatters, market, socketData }: CoinProps) {
	const change: Change = socketData[market.market]?.change;

	const trade_price = formatters.formatTradePrice(
		socketData[market.market]?.trade_price,
	);
	const change_rate = formatters.formatChangeRate(
		socketData[market.market]?.signed_change_rate,
		change,
	);
	const change_price = formatters.formatSignedChangePrice(
		socketData[market.market]?.signed_change_price,
		change,
	);
	const acc_trade_price_24h = formatters.formatAccTradePrice(
		socketData[market.market]?.acc_trade_price_24h,
	);

	const colorClasses = {
		FALL: 'text-blue-600',
		RISE: 'text-red-500',
		EVEN: 'text-gray-800',
	} as const;

	return (
		<Link
			to={`/trade/${market.market}`}
			className="flex items-center py-1 border-b border-solid border-gray-300 cursor-pointer hover:bg-gray-100"
			key={market.market}
		>
			<div className="fill-blue-gray-100 flex-[1] flex w-5 h-5 hover:fill-red-400">
				<Heart />
			</div>

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
					<span className="block">{change_rate}</span>
					<span className="block text-sm">{change_price}</span>
				</div>
			</div>
			<div className="flex-[6]">{acc_trade_price_24h}</div>
		</Link>
	);
}

export default Coin;
