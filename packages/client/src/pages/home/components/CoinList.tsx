import { useWSTicker } from '@/hooks/useWSTicker';
import { MarketData } from '@/types/market';
import Heart from '@asset/heart.svg?react';

const formatData = (category: string) => {
	const formatters = {
		formatTradePrice: (price: string) => {},
		formatSignedChangePrice: (price: string) => {},
		formatChangeRate: (price: string) => {},
		formatAccTradePrice: (price: string) => {},
	};

	// category별로 다른 로직이 필요한 경우 여기서 처리
	switch (category) {
		case 'KRW':
			formatters.formatTradePrice = (price: string) =>
				`${Number(price).toLocaleString()}원`;

			formatters.formatSignedChangePrice = (price: string) =>
				`${Number(price).toLocaleString()}원`;

			formatters.formatChangeRate = (price: string) =>
				`(${(Number(price) * 100).toFixed(2)}%)`;

			formatters.formatAccTradePrice = (price: string) =>
				`${Math.floor(Number(price) / 1000000).toLocaleString()}백만`;
			break;

		case 'BTC':
			formatters.formatTradePrice = (price: string) =>
				`${Number(price).toFixed(8)} BTC`;

			formatters.formatSignedChangePrice = (price: string) => ``;

			formatters.formatChangeRate = (price: string) =>
				`${(Number(price) * 100).toFixed(2)}%`;

			formatters.formatAccTradePrice = (price: string) =>
				`${Number(price).toFixed(3)}`;
			break;
		case 'USDT':
			formatters.formatTradePrice = (price: string) =>
				`${Number(price).toLocaleString()} USDT`;

			formatters.formatSignedChangePrice = (price: string) => ``;

			formatters.formatChangeRate = (price: string) =>
				`${(Number(price) * 100).toFixed(2)}%`;

			formatters.formatAccTradePrice = (price: string) =>
				`${Math.floor(Number(price)).toLocaleString()}`;
			break;
	}

	return formatters;
};

function CoinList({ markets, activeCategory }: { markets: MarketData[] }) {
	const { socketData, isConnected } = useWSTicker(markets);
	const formatters = formatData(activeCategory);

	// console.log(socketData)

	// const categoryTodata = {
	// 	"KRW" : {
	// 		currentPrice : socketData[market.market]?.trade_price?.toLocaleString() + '원',

	// 	}
	// }

	if (!socketData) return;
	if (!isConnected) return;

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
						{formatters.formatTradePrice(
							socketData[market.market]?.trade_price,
						)}
					</div>
					<div className="flex-[6]">
						{`${formatters.formatSignedChangePrice(socketData[market.market]?.signed_change_price)}${formatters.formatChangeRate(socketData[market.market]?.signed_change_rate)}
							`}
					</div>
					<div className="flex-[6]">
						{formatters.formatAccTradePrice(
							socketData[market.market]?.acc_trade_price_24h,
						)}
					</div>
				</div>
			))}
		</div>
	);
}

export default CoinList;
