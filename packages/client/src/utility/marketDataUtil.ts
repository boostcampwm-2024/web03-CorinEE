import { MarketData } from '@/types/market';

type Market = 'KRW' | 'BTC' | 'USDT';

export function filterCoin(data: MarketData[], type: Market) {
  const regex = new RegExp(`^${type}-\\w+`);

	return data.filter((data) => regex.test(data.market));
}
