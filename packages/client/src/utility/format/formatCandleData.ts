import { Time } from 'lightweight-charts';
import { Candle, CandleFormat } from '@/types/chart';
export function formatCandleData(data: Candle[]): CandleFormat[] {
	const uniqueData = data.reduce(
		(acc, current) => {
			const date = new Date(current.candle_date_time_kst);
			const timeKey = date.getTime() + 9 * 60 * 60 * 1000;
			acc[timeKey] = current;
			return acc;
		},
		{} as Record<number, Candle>,
	);

	const sortedData = Object.values(uniqueData).sort((a, b) => {
		const dateA =
			new Date(a.candle_date_time_kst).getTime() + 9 * 60 * 60 * 1000;
		const dateB =
			new Date(b.candle_date_time_kst).getTime() + 9 * 60 * 60 * 1000;
		return dateA - dateB;
	});

	const formattedData = sortedData.map((candle) => ({
		time: ((new Date(candle.candle_date_time_kst).getTime() +
			9 * 60 * 60 * 1000) /
			1000) as Time,
		open: candle.opening_price,
		high: candle.high_price,
		low: candle.low_price,
		close: candle.trade_price,
	}));

	return formattedData;
}
