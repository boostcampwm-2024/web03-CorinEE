import { authInstance } from '@/api/instance';
import { AccountHistory } from '@/types/history';

export async function myHistory(token: string): Promise<AccountHistory[]> {
	const response = await authInstance.get(`/tradehistory/tradehistoryData`, {
		
	});

	return response.data.result;
}
