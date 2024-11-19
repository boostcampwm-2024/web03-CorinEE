import { Time } from 'lightweight-charts';

export type Candle = {
	market: string;
	candle_date_time_utc: string;
	candle_date_time_kst: string;
	opening_price: number;
	high_price: number;
	low_price: number;
	trade_price: number;
	timestamp: number;
	candle_acc_trade_price: number;
	candle_acc_trade_volume: number;
	prev_closing_price: number;
	change_price: number;
	change_rate: number;
};

export type CandleFormat = {
	time: Time;
	open: number;
	high: number;
	low: number;
	close: number;
};

export type InfiniteCandle = {
	candles: Candle[];
	hasNextPage: boolean;
};

export type CandlePeriod = 'minutes' | 'days' | 'weeks' | 'months' | 'years';
export type CandleMinutes = 1 | 3 | 5 | 10 | 15 | 30 | 60;
