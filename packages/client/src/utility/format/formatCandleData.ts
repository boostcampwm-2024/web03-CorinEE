import { Candle, CandleFormat } from '@/types/chart';

export function formatCandleData(data: Candle[]): CandleFormat[] {
	return data
		.map((candle) => ({
			time: candle.candle_date_time_utc.split('T')[0],
			open: candle.opening_price,
			high: candle.high_price,
			low: candle.low_price,
			close: candle.trade_price,
		}))
		.reverse();
}
