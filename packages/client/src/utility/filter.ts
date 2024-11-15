import { MarketData } from '@/types/market';
import { Market } from '@/types/market';

export function filterCoin(data: MarketData[], type: Market) {
	const regex = new RegExp(`^${type}-\\w+`);
	console.log(data)
	return data.filter((data) => regex.test(data.market));
}