import {
	ChartOptions,
	CandlestickSeriesOptions,
	DeepPartial,
} from 'lightweight-charts';

export interface ChartConfig {
	chartOptions: DeepPartial<ChartOptions>;
	candleStickOptions: DeepPartial<CandlestickSeriesOptions>;
}
export const chartConfig = {
	chartOptions: {
		height: 600,
		layout: {
			background: { color: '#F9FAFB' },
			textColor: '#243c5a',
			fontFamily: "'Pretendard', sans-serif",
		},
		grid: {
			vertLines: { color: '#1111' },
			horzLines: { color: '#1111' },
		},
		timeScale: {
			rightOffset: 5,
			barSpacing: 10,
		},
	},
	candleStickOptions: {
		wickUpColor: 'rgb(225, 50, 85)',
		upColor: 'rgb(225, 50, 85)',
		wickDownColor: 'rgb(54, 116, 217)',
		downColor: 'rgb(54, 116, 217)',
		borderVisible: false,
	},
};
