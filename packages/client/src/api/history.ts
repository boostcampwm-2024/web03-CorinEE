import { instance } from '@/api/instance';
import { History } from '@/types/history';

export async function myHistory(token: string): Promise<History[]> {
	const response = await instance.get(`/tradehistory/tradehistoryData`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	return response.data.result;
}
