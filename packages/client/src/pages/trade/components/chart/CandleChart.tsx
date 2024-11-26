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

	const getPeriodMs = () => {
		switch (activePeriod) {
			case 'minutes':
				return (minute || 1) * 60 * 1000;
			case 'days':
				return 24 * 60 * 60 * 1000;
			case 'weeks':
				return 7 * 24 * 60 * 60 * 1000;
			case 'months':
				return 30 * 24 * 60 * 60 * 1000;
			default:
				return 60 * 1000;
		}
	};

	const getCurrentCandleStartTime = () => {
		const now = new Date();
		const periodMs = getPeriodMs();

		switch (activePeriod) {
			case 'minutes':
				return ((Math.floor(now.getTime() / periodMs) * periodMs) /
					1000) as Time;

			case 'days':
				const startOfDay = new Date(now);
				startOfDay.setUTCHours(0, 0, 0, 0);
				return (startOfDay.getTime() / 1000) as Time;

			case 'weeks':
				const startOfWeek = new Date(now);
				startOfWeek.setUTCHours(0, 0, 0, 0);
				const day = startOfWeek.getUTCDay();
				const diff = startOfWeek.getUTCDate() - day + (day === 0 ? -6 : 1);
				startOfWeek.setUTCDate(diff);
				return (startOfWeek.getTime() / 1000) as Time;

			case 'months':
				const startOfMonth = new Date(now);
				startOfMonth.setUTCHours(0, 0, 0, 0);
				startOfMonth.setUTCDate(1);
				return (startOfMonth.getTime() / 1000) as Time;

			default:
				return ((Math.floor(now.getTime() / periodMs) * periodMs) /
					1000) as Time;
		}
	};

	const updateRealTimeCandle = () => {
		if (!seriesRef.current) return;

		const currentCandleStartTime = getCurrentCandleStartTime();

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

		const updateInterval = activePeriod === 'minutes' ? 1000 : 5000;
		intervalRef.current = setInterval(updateRealTimeCandle, updateInterval);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [currentPrice, minute]);
	return <div ref={chartRef} />;
}

export default CandleChart;
