import { instance } from '@/api/instance';
import { Candle, CandlePeriod } from '@/types/chart';
import { MarketData, SidebarMarketData } from '@/types/market';
import { CoinTicker } from '@/types/ticker';

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

export async function getMarketTicker(
	queryString: string,
): Promise<CoinTicker[]> {
	const response = await instance.get(`/upbit/market/tickers?${queryString}`);
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
			? `/upbit/candle/${params}/${minutes}`
			: `/upbit/candle/${params}`;

	const response = await instance.get(url, {
		params: {
			market,
			count: 200,
			to: to ?? '',
		},
	});

	return response.data.result;
}
