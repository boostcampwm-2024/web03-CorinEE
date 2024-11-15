import { instance,upbitInstance } from '@/api/instance';
import { Candle, CandlePeriod } from '@/types/chart';
import { MarketData, MarketTop20Data } from '@/types/market';

export async function getMarketAll(): Promise<MarketData[]> {
	const response = await instance.get('/upbit/market/all');
	return response.data;
}

export async function getMarketTop20(): Promise<MarketTop20Data[]> {
	const response = await instance.get('upbit/market/top20-trade/krw');
	return response.data;
}

export async function getRecentlyMarketList(queryString: string): Promise<MarketTop20Data[]> {
	const response = await instance.get(`upbit/market/simplelist/krw?${queryString}`);
	return response.data;
}

export async function getCandleByPeriod(
	market: string,
	params: CandlePeriod,
): Promise<Candle[]> {
	const response = await upbitInstance.get(`/candles/${params}`, {
		params: {
			market,
			count: 200,
			to: '',
		},
	});
	return response.data;
}
