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
	time: string;
	open: number;
	high: number;
	low: number;
	close: number;
};

export type CandlePeriod = 'days' | 'weeks' | 'months' | 'years';
