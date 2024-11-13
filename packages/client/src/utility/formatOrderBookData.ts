import { OrderBook } from '@/types/orderbook';

export function formatAsks(data: OrderBook) {
	return data.orderbook_units
		.map(({ ask_price, ask_size, ask_rate }) => ({
			ask_price,
			ask_size,
			ask_rate,
		}))
		.reverse();
}

export function formatBids(data: OrderBook) {
	return data.orderbook_units.map(({ bid_price, bid_size, bid_rate }) => ({
		bid_price,
		bid_size,
		bid_rate,
	}));
}
