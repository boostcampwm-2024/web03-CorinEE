import { instance, upbitInstance } from '@/api/instance';
import { Candle, CandlePeriod } from '@/types/chart';
import { MarketData, SidebarMarketData } from '@/types/market';

export async function getMarketAll(): Promise<MarketData[]> {
	const response = await instance.get('/upbit/market/all');
	return response.data;
}

export async function getMarketTop20(): Promise<SidebarMarketData[]> {
	const response = await instance.get('/upbit/market/top20-trade/krw');
	return response.data;
}

export async function getRecentlyMarketList(
	queryString: string,
): Promise<SidebarMarketData[]> {
	const response = await instance.get(
		`/upbit/market/simplelist/krw?${queryString}`,
	);
	return response.data;
}

export async function getCandleByPeriod(
	market: string,
	params: CandlePeriod,
	to?: string,
	minutes?: number,
): Promise<Candle[]> {
	const url =
		params === 'minutes'
			? `/candles/${params}/${minutes}`
			: `/candles/${params}`;

	const response = await upbitInstance.get(url, {
		params: {
			market,
			count: 200,
			to: to ?? '',
		},
	});

	return response.data;
}
