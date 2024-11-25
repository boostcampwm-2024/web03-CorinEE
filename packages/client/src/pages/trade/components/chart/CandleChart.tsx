import { useRef, useEffect } from 'react';
import { Candle, CandleFormat, CandlePeriod } from '@/types/chart';
import { IChartApi, ISeriesApi, Time } from 'lightweight-charts';
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
	const chartRef = useRef<HTMLDivElement>(null);
	const chartInstanceRef = useRef<IChartApi | null>(null);
	const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
	const lastCandleRef = useRef<CandleFormat | null>(null);
	const intervalRef = useRef<number | null>(null);

	const updateRealTimeCandle = () => {
		if (!seriesRef.current || !minute) return;

		const now = new Date().getTime();
		const candlePeriodMs = (minute || 1) * 60 * 1000;
		const currentCandleStartTime = ((Math.floor(now / candlePeriodMs) *
			candlePeriodMs) /
			1000) as Time;

		if (
			!lastCandleRef.current ||
			lastCandleRef.current.time !== currentCandleStartTime
		) {
			const newCandle = {
				time: currentCandleStartTime,
				open: currentPrice,
				high: currentPrice,
				low: currentPrice,
				close: currentPrice,
			};
			lastCandleRef.current = newCandle;
			seriesRef.current.update(newCandle);
		} else {
			const updatedCandle = {
				...lastCandleRef.current,
				close: currentPrice,
				high: Math.max(lastCandleRef.current.high, currentPrice),
				low: Math.min(lastCandleRef.current.low, currentPrice),
			};
			lastCandleRef.current = updatedCandle;
			seriesRef.current.update(updatedCandle);
		}
	};

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
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, []);

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

	useEffect(() => {
		if (!seriesRef.current) return;
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}
		updateRealTimeCandle();
		intervalRef.current = setInterval(updateRealTimeCandle, 1000);
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [currentPrice, minute]);
	return <div ref={chartRef} />;
}

export default CandleChart;
