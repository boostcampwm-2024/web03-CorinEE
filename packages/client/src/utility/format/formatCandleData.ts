import { Candle, CandleFormat } from '@/types/chart';
import { Time } from 'lightweight-charts';

export function formatCandleData(data: Candle[]): CandleFormat[] {
	return data
		.map((candle) => ({
			time: (new Date(candle.candle_date_time_kst).getTime() / 1000) as Time,
			open: candle.opening_price,
			high: candle.high_price,
			low: candle.low_price,
			close: candle.trade_price,
		}))
		.reverse();
}
