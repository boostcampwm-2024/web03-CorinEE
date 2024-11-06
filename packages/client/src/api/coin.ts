import { instance } from '@/api/instance';

export async function getMarketAll() {
	return await instance.get('/market/all?is_details=true');}
