import { useWSTicker } from '@/hooks/useWSTicker';
import { MarketData } from '@/types/market';
import Heart from '@asset/heart.svg?react';

const formatTradePrice = (price: number) => {
	if (!price) return '-';

	if (price >= 100000000) {
		// 1억 이상
		return (price / 100000000).toFixed(0) + '억';
	} else {
		return (price / 10000000).toFixed(0) + '천만';
	}
};

function CoinList({ markets }: { markest: MarketData[] }) {
	const { socketData } = useWSTicker(markets);

	// console.log(socketData)

	if (!socketData) return;

	return (
		<div className="w-[90%]">
			<ul className="flex py-4 border-b border-solid border-gray-300 text-gray-700">
				<li className="flex-[1]">관심</li>
				<li className="flex-[6]">한글명</li>
				<li className="flex-[6]">현재가</li>
				<li className="flex-[6]">전일대비</li>
				<li className="flex-[6]">거래대금</li>
			</ul>

			{markets.map((market) => (
				<div
					className="flex items-center py-1 border-b border-solid border-gray-300"
					key={market.market}
				>
					<div className="fill-blue-gray-100 flex-[1] flex w-5 h-5">
						<Heart />
					</div>

					<div className="flex items-center gap-2 flex-[6]">
						<img
							className="w-7 h-7"
							src={`https://static.upbit.com/logos/${market.market.split('-')[1]}.png`}
						></img>

						<div className="flex flex-col">
							<p className="text-gray-700">{market.korean_name}</p>
							<p className="text-gray-700 text-xs">{market.market}</p>
						</div>
					</div>

					<div className="flex-[6]">
						{socketData[market.market]?.trade_price?.toLocaleString() + '원'}
					</div>
					<div className="flex-[6]">
						{`${socketData[market.market]?.signed_change_price.toLocaleString()}원 (${(socketData[market.market]?.signed_change_rate * 100).toFixed(2)}%) 
							`}
					</div>
					<div className="flex-[6]">
						{formatTradePrice(socketData[market.market]?.acc_trade_price_24h)}
					</div>
				</div>
			))}
		</div>
	);
}

export default CoinList;
