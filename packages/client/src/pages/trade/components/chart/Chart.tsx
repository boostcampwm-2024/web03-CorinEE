import { usePeriodChart } from '@/hooks/usePeriodChart';
import { useState } from 'react';
import ChartSelector from '@/pages/trade/components/chart/ChartSelector';
import { CandlePeriod } from '@/types/chart';
import CandleChart from '@/pages/trade/components/chart/CandleChart';

function Chart({ market }: { market: string }) {
	const [activePeriod, setActivePeriod] = useState<CandlePeriod>('days');
	const [minute, setMinute] = useState<number>();
	const { data, fetchNextPage } = usePeriodChart(market, activePeriod, minute);

	const handleActivePeriod = (period: CandlePeriod, minute?: number) => {
		setActivePeriod(period);
		setMinute(minute);
	};

	return (
		<div className="bg-gray-50 min-w-80 rounded-lg flex-[2] overflow-hidden">
			<ChartSelector
				activePeriods={activePeriod}
				handleActivePeriod={handleActivePeriod}
			/>
			<CandleChart
				activePeriod={activePeriod}
				data={data.candles.flat()}
				fetchNextPage={fetchNextPage}
			/>
		</div>
	);
}

export default Chart;
