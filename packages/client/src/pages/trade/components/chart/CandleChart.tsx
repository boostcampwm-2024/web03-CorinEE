import { useRef } from 'react';
import { useEffect } from 'react';
import { Candle } from '@/types/chart';
import { IChartApi, ISeriesApi } from 'lightweight-charts';
import {
	initializeChart,
	setupCandlestickSeries,
} from '@/pages/trade/components/chart/chartSetup';
import { chartConfig } from '@/pages/trade/components/chart/config';
import { formatCandleData } from '@/utility/format/formatCandleData';

function CandleChart({ data }: { data: Candle[] }) {
	const chartRef = useRef<HTMLDivElement>(null);
	const chartInstanceRef = useRef<IChartApi | null>(null);
	const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

	const handleResize = () => {
		// resize 로직 추후 파일 분리 예정
		if (chartRef.current && chartInstanceRef.current) {
			const { width } =
				chartRef.current.parentElement?.getBoundingClientRect() || { width: 0 };
			chartInstanceRef.current.applyOptions({
				width: width,
			});
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
			handleResize();
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
		if (!seriesRef.current) return;
		const formattedData = formatCandleData(data);
		seriesRef.current.setData(formattedData);
	}, [data]);

	return <div ref={chartRef} />;
}

export default CandleChart;
