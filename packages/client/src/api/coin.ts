import { instance } from '@/api/instance';
import { Candle } from '@/types/chart';
import { MarketData } from '@/types/market';

export async function getMarketAll(): Promise<MarketData[]> {
	const response = await instance.get('/market/all?is_details=true');
	return response.data;
}

export async function getCandleByPeriod(
	market: string,
	params: 'days' | 'weeks' | 'months' | 'years',
): Promise<Candle[]> {
	const response = await instance.get(`/candles/${params}`, {
		params: {
			market,
			count: 200,
			to: '',
		},
	});
	return response.data;
}
