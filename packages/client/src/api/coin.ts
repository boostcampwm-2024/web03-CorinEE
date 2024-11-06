import { instance } from '@/api/instance';
import { MarketData } from '@/types/market';

export async function getMarketAll(): Promise<MarketData[]>  {
	const response = await instance.get('/market/all?is_details=true');
	return response.data;
}
