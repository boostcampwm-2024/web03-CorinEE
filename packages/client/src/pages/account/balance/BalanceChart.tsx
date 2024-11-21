import { AccountCoin } from '@/types/account';
import {
	Chart as ChartJS,
	ArcElement,
	Tooltip,
	Legend,
	Colors,
	TooltipItem,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// 필요한 컴포넌트들을 등록
ChartJS.register(ArcElement, Tooltip, Legend, Colors);

type BalanceChartProps = {
	total_bid: number;
	coins: AccountCoin[];
};

function BalanceChart({ coins, total_bid }: BalanceChartProps) {
	const balanceMarketList = coins.map((coin) => {
		return {
			market: coin.market,
			value: Math.floor((coin.price / total_bid) * 100),
		};
	});

	const sortedBalanceMarketList = [...balanceMarketList].sort(
		(a, b) => b.value - a.value,
	);

	const data = {
		labels: sortedBalanceMarketList.map((item) => item.market),
		datasets: [
			{
				data: sortedBalanceMarketList.map((item) => item.value),
				hoverOffset: 4,
			},
		],
	};

	const options = {
		plugins: {
			colors: {
				forceOverride: true,
			},
			legend: {
				position: 'bottom' as const, // 범례 위치
				onClick: () => {},
				labels: {
					// 범례 라벨 커스터마이징
					generateLabels: (chart: ChartJS) => {
						const data = chart.data;
						const dataset = data.datasets[0];
						const colors = dataset.backgroundColor as string[];

						return (
							data.labels?.map((label, index) => ({
								text: `${label}: ${dataset.data[index]}%`,
								fillStyle: colors?.[index] || '#000000',
								hidden: false,
								index: index,
							})) || []
						);
					},
				},
			},
			tooltip: {
				position: 'nearest' as const,
				callbacks: {
					// 툴팁 커스터마이징
					label: function (context: TooltipItem<'doughnut'>) {
						const label = context.label;
						const value = context.raw;
						return ` ${label}: ${value}%`;
					},
				},
				yAlign: 'bottom' as const,
				xAlign: 'center' as const,
			},
		},
		responsive: true,
		maintainAspectRatio: false,
	};

	return (
		<div className="w-2/5 relative flex justify-center">
			<Doughnut data={data} options={options} />
			<div
				className={`absolute flex flex-col text-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[90%] text-sm text-gray-700 font-semibold`}
			>
				<span>보유 비중</span>
				<span>(%)</span>
			</div>
		</div>
	);
}

export default BalanceChart;
