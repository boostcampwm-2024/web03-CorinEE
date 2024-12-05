import { authInstance } from '@/api/instance';
import { AccountWaitOrder } from '@/types/waitOrder';

export async function myWaitOrders(coin?: string): Promise<AccountWaitOrder[]> {
	const params = coin ? `?coin=${coin}` : '';
	const response = await authInstance.get(`/trade/tradeData${params}`);
	return response.data.result;
}

export async function deleteWaitOrders(tradeId: number, tradeType: string) {
	const params = new URLSearchParams({
		tradeId: tradeId.toString(),
		tradeType: tradeType,
	});

	const response = await authInstance.delete<{ status: number }>(
		`/trade/tradeData?${params.toString()}`,
	);

	return response.data;
}
