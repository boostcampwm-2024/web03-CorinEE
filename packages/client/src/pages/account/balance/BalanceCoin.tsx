import { Change, CoinTicker } from '@/types/ticker';
import colorClasses from '@/constants/priceColor';
import { AccountCoin } from '@/types/account';
import { useEffect, useState } from 'react';

type BalanceCoinProps = {
	coin: AccountCoin;
	sseData: CoinTicker | undefined | null;
};

function BalanceCoin({ coin, sseData }: BalanceCoinProps) {
	const averagePrice = (coin.price / coin.quantity).toFixed(2);

	if (!sseData) return;

	const evaluationPrice = Math.floor(sseData.trade_price * coin.quantity);

	const profitPrice = evaluationPrice - coin.price;
	const profitRate = (
		((evaluationPrice - coin.price) / coin.price) *
		100
	).toFixed(2);
	const change: Change =
		profitPrice > 0 ? 'RISE' : profitPrice < 0 ? 'FALL' : 'EVEN';

	return (
		<div className="flex border-b border-solid border-gray-300">
			<div className="flex-[1]  pt-3 px-3">
				<div className="flex items-center gap-3">
					<img className="w-7 h-7" src={coin.img_url} />
					<div className="flex flex-col">
						<p className="font-semibold">{coin.koreanName}</p>
						<p className="text-gray-700 text-xs">{coin.market}</p>
					</div>
				</div>
			</div>
			<div className="flex-[1] p-3 text-end">
				<span className="text-base ">{coin.quantity.toLocaleString()}</span>
				<span className="text-xs ml-1 text-gray-500">{coin.market}</span>
			</div>
			<div className="flex-[1] p-3 text-end">
				<span className="text-base">{averagePrice}</span>
				<span className="text-xs ml-1 text-gray-500">KRW</span>
			</div>
			<div className="flex-[1] p-3 text-end">
				<span className="text-base">{coin.price.toLocaleString()}</span>
				<span className="text-xs ml-1 text-gray-500">KRW</span>
			</div>
			<div className="flex-[1] p-3 text-end">
				<span className="text-base font-bold">
					{evaluationPrice.toLocaleString()}
				</span>
				<span className="text-xs ml-1 text-gray-500">KRW</span>
			</div>
			<div className="flex-[1] p-3">
				<div className="flex flex-col text-end mr-12">
					<div className="">
						<span className={`text-base ${colorClasses[change]}`}>
							{profitRate}
						</span>
						<span className="text-xs ml-1 text-gray-500">%</span>
					</div>
					<div className="">
						<span className={`text-base ${colorClasses[change]}`}>
							{Math.floor(profitPrice)}
						</span>
						<span className="text-xs ml-1 text-gray-500">KRW</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default BalanceCoin;
