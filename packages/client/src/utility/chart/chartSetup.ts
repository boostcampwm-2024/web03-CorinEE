import { IChartApi, createChart, ISeriesApi } from 'lightweight-charts';
import { CandleFormat } from '@/types/chart';
import { ChartConfig } from '@/utility/chart/config';

export const initializeChart = (
	container: HTMLElement,
	config: ChartConfig,
): IChartApi => {
	const chart = createChart(container, config.chartOptions);

	chart.timeScale().applyOptions({
		borderColor: '#1111',
		timeVisible: true,
	});

	return chart;
};

export const setupCandlestickSeries = (
	chart: IChartApi,
	data: CandleFormat[],
	config: ChartConfig,
): ISeriesApi<'Candlestick'> => {
	const candlestickSeries = chart.addCandlestickSeries();

	candlestickSeries.priceScale().applyOptions({
		borderColor: '#1111',
	});

	candlestickSeries.applyOptions(config.candleStickOptions);
	candlestickSeries.setData(data);

	return candlestickSeries;
};
