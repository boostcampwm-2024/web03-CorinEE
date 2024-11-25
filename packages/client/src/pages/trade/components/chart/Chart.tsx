import { usePeriodChart } from '@/hooks/market/usePeriodChart';
import { useState } from 'react';
import ChartSelector from '@/pages/trade/components/chart/ChartSelector';
import { CandlePeriod } from '@/types/chart';
import CandleChart from '@/pages/trade/components/chart/CandleChart';

type ChartProps = {
	market: string;
	currentPrice: number;
};

function Chart({ market, currentPrice }: ChartProps) {
	const [activePeriod, setActivePeriod] = useState<CandlePeriod>('days');
	const [minute, setMinute] = useState<number>();
	const { data, fetchNextPage } = usePeriodChart(market, activePeriod, minute);

	const handleActivePeriod = (period: CandlePeriod, minute?: number) => {
		setActivePeriod(period);
		setMinute(minute);
	};

	return (
		<div className="bg-gray-50 min-w-80 rounded-lg flex-[2] overflow-y-auto overflow-x-hidden min-h-0 z-0">
			<ChartSelector
				activePeriods={activePeriod}
				handleActivePeriod={handleActivePeriod}
			/>
			<CandleChart
				activePeriod={activePeriod}
				minute={minute}
				data={data.candles.flat()}
				fetchNextPage={fetchNextPage}
				currentPrice={currentPrice}
			/>
		</div>
	);
}

export default Chart;
