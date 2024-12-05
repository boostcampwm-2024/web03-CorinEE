export type OrderBook = {
	type: string;
	code: string;
	timestamp: number;
	total_ask_size: number;
	total_bid_size: number;
	orderbook_units: OrderBookUnit[];
	stream_type: string;
	level: number;
	korean_name: string;
	image_url: string;
};

export type OrderBookUnit = {
	ask_price: number;
	bid_price: number;
	ask_size: number;
	bid_size: number;
	ask_rate: string;
	bid_rate: string;
};

export type SSEOrderBook = {
	[key: string]: OrderBook;
};
