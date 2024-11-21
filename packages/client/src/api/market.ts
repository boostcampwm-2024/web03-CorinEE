import { instance } from '@/api/instance';
import { Candle, CandlePeriod } from '@/types/chart';
import { MarketData, SidebarMarketData } from '@/types/market';

export async function getMarketAll(): Promise<MarketData[]> {
	const response = await instance.get('/api/upbit/market/all');
	return response.data;
}

export async function getMarketTop20(): Promise<SidebarMarketData[]> {
	const response = await instance.get('/api/upbit/market/top20-trade/krw');
	return response.data;
}

export async function getRecentlyMarketList(
	queryString: string,
): Promise<SidebarMarketData[]> {
	const response = await instance.get(
		`/api/upbit/market/simplelist/krw?${queryString}`,
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
			? `/api/upbit/candle/${params}/${minutes}`
			: `/api/upbit/candle/${params}`;

	const response = await instance.get(url, {
		params: {
			market,
			count: 200,
			to: to ?? '',
		},
	});

	return response.data.result;
}
