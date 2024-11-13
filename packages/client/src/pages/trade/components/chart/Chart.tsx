import { usePeriodChart } from '@/hooks/usePeriodChart';
import { useState } from 'react';
import ChartSelector from '@/pages/trade/components/chart/ChartSelector';
import { CandlePeriod } from '@/types/chart';
import CandleChart from '@/pages/trade/components/chart/CandleChart';
function Chart({ market }: { market: string }) {
	const [activePeriod, setActivePeriod] = useState<CandlePeriod>('days');

	const { data } = usePeriodChart(market, activePeriod);
	const handleActivePeriod = (period: CandlePeriod) => {
		setActivePeriod(period);
	};

	return (
		<div className="bg-gray-50 min-w-80 rounded-lg flex-[2] overflow-hidden">
			<ChartSelector
				activePeriods={activePeriod}
				handleActivePeriod={handleActivePeriod}
			/>
			<CandleChart data={data} />
		</div>
	);
}

export default Chart;
