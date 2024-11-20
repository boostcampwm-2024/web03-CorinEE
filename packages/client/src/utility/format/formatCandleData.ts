import { Candle, CandleFormat } from '@/types/chart';
import { Time } from 'lightweight-charts';

export function formatCandleData(data: Candle[]): CandleFormat[] {
	const uniqueData = data.reduce(
		(acc, current) => {
			const timeKey = new Date(current.candle_date_time_kst).getTime();
			acc[timeKey] = current;
			return acc;
		},
		{} as Record<number, Candle>,
	);

	const sortedData = Object.values(uniqueData).sort((a, b) => {
		const dateA = new Date(a.candle_date_time_kst).getTime();
		const dateB = new Date(b.candle_date_time_kst).getTime();
		return dateA - dateB;
	});

	const formattedData = sortedData.map((candle) => ({
		time: (new Date(candle.candle_date_time_kst).getTime() / 1000) as Time,
		open: candle.opening_price,
		high: candle.high_price,
		low: candle.low_price,
		close: candle.trade_price,
	}));

	return formattedData;
}
