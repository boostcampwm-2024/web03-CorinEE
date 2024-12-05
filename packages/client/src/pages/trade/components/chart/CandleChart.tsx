import { useEffect } from 'react';
import { Candle, CandlePeriod } from '@/types/chart';
import { formatCandleData } from '@/utility/format/formatCandleData';
import { handleScroll } from '@/utility/chart/chartEvent';
import { useRealTimeCandle } from '@/hooks/chart/useRealTimeCandle';
import { useChartSetup } from '@/hooks/chart/useChartSetup';

type CandleChartProps = {
	activePeriod: CandlePeriod;
	minute: number | undefined;
	data: Candle[];
	fetchNextPage: () => Promise<unknown>;
	currentPrice: number;
};

function CandleChart({
	activePeriod,
	minute,
	data,
	fetchNextPage,
	currentPrice,
}: CandleChartProps) {
	const { chartRef, chartInstanceRef, seriesRef } = useChartSetup();
	const { lastCandleRef } = useRealTimeCandle({
		seriesRef,
		currentPrice,
		activePeriod,
		minute,
	});

	useEffect(() => {
		if (!seriesRef.current || !chartInstanceRef.current) return;
		const formattedData = formatCandleData(data);
		seriesRef.current.setData(formattedData);
		lastCandleRef.current = formattedData[formattedData.length - 1];
	}, [data]);

	useEffect(() => {
		if (!chartInstanceRef.current) return;
		chartInstanceRef.current.timeScale().scrollToPosition(0, false);
	}, [activePeriod, minute]);

	useEffect(() => {
		if (!chartRef.current || !chartInstanceRef.current) return;
		chartInstanceRef.current
			.timeScale()
			.subscribeVisibleLogicalRangeChange(handleScroll(fetchNextPage));
	}, []);

	return <div ref={chartRef} />;
}

export default CandleChart;
