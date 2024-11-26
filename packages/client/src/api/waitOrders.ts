import { authInstance } from '@/api/instance';
import { useToast } from '@/hooks/ui/useToast';
import { AccountWaitOrder } from '@/types/waitOrder';

export async function myWaitOrders(): Promise<AccountWaitOrder[]> {
	const response = await authInstance.get(`/trade/tradeData`, {});
	return response.data.result;
}

export async function deleteWaitOrders(
	tradeId: number,
	tradeType: string,
): Promise<void> {
	const toast = useToast();
	const params = new URLSearchParams({
		tradeId: tradeId.toString(),
		tradeType: tradeType,
	});

	const response = await authInstance.delete<{ status: number }>(
		`/trade/tradeData?${params.toString()}`,
	);

	if (response.status === 200) {
		toast.success('주문을 취소하였습니다.');
	} else {
		toast.error('주문 취소를 실패했습니다.');
	}
}
