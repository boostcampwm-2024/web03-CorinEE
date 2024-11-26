import {
	initializeChart,
	setupCandlestickSeries,
} from '@/utility/chart/chartSetup';
import { useRef, useEffect } from 'react';
import { IChartApi, ISeriesApi } from 'lightweight-charts';
import { chartConfig } from '@/utility/chart/config';
import { handleResize } from '@/utility/chart/chartEvent';

export function useChartSetup() {
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

	return { chartRef, chartInstanceRef, seriesRef };
}
