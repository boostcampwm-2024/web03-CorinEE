import { useRef, useEffect } from 'react';
import { Candle, CandlePeriod } from '@/types/chart';
import { IChartApi, ISeriesApi } from 'lightweight-charts';
import {
	initializeChart,
	setupCandlestickSeries,
} from '@/pages/trade/components/chart/chartSetup';
import { chartConfig } from '@/pages/trade/components/chart/config';
import { formatCandleData } from '@/utility/format/formatCandleData';
import {
	handleResize,
	handleScroll,
} from '@/pages/trade/components/chart/chartEvent';

type CandleChartProps = {
	activePeriod: CandlePeriod;
	data: Candle[];
	fetchNextPage: () => Promise<unknown>;
};

function CandleChart({ activePeriod, data, fetchNextPage }: CandleChartProps) {
	const chartRef = useRef<HTMLDivElement>(null);
	const chartInstanceRef = useRef<IChartApi | null>(null);
	const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

	useEffect(() => {
		if (!chartRef.current) return;
		chartInstanceRef.current = initializeChart(chartRef.current, chartConfig);
		seriesRef.current = setupCandlestickSeries(
			chartInstanceRef.current,
			[],
			chartConfig,
		);
		const resizeObserver = new ResizeObserver(() => {
			handleResize(chartRef, chartInstanceRef);
		});

		if (chartRef.current.parentElement) {
			resizeObserver.observe(chartRef.current.parentElement);
		}

		return () => {
			if (chartInstanceRef.current) {
				resizeObserver.disconnect();
				chartInstanceRef.current.remove();
			}
		};
	}, []);

	useEffect(() => {
		if (!seriesRef.current || !chartInstanceRef.current) return;
		const formattedData = formatCandleData(data);
		seriesRef.current.setData(formattedData);
	}, [data]);

	useEffect(() => {
		if (!chartInstanceRef.current) return;
		chartInstanceRef.current.timeScale().scrollToPosition(0, false);
	}, [activePeriod]);

	useEffect(() => {
		if (!chartRef.current || !chartInstanceRef.current) return;
		chartInstanceRef.current
			.timeScale()
			.subscribeVisibleLogicalRangeChange(handleScroll(fetchNextPage));
	}, []);

	return <div ref={chartRef} />;
}

export default CandleChart;
