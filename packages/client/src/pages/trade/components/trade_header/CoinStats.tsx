import Heart from '@asset/heart.svg?react';
type CoinStatsProps = {
	acc_trade_price_24h: string;
	high_price: string;
	low_price: string;
};

function CoinStats({
	acc_trade_price_24h,
	high_price,
	low_price,
}: CoinStatsProps) {
	const STATS = [
		{
			name: '거래대금(24h)',
			value: acc_trade_price_24h,
			color: 'text-gray-800',
		},
		{
			name: '고가',
			value: high_price,
			color: 'text-red-500',
		},
		{
			name: '저가',
			value: low_price,
			color: 'text-blue-600',
		},
	];

	return (
		<div className="flex gap-4 items-center">
			{STATS.map((stat) => (
				<div
					key={stat.name}
					className="flex flex-col text-gray-800 text-sm gap-1 "
				>
					<span>{stat.name}</span>
					<span className={stat.color}>{stat.value} 원</span>
				</div>
			))}
			<div className="border border-solid border-white rounded-lg p-1 bg-gray-200">
				<Heart className="w-6 h-6 fill-blue-gray-200 hover:fill-red-400" />
			</div>
		</div>
	);
}

export default CoinStats;
