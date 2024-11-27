import { deleteWaitOrders } from '@/api/waitOrders';
import { useToast } from '@/hooks/ui/useToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteWaitOrder() {
	const QUERY_KEY = 'DELETE_ORDER';
	const queryClient = useQueryClient();
	const toast = useToast();
	const deleteOrder = useMutation({
		mutationFn: (params: { tradeId: number; tradeType: string }) =>
			deleteWaitOrders(params.tradeId, params.tradeType),
		mutationKey: [QUERY_KEY],

		onSuccess: () => {
			toast.success('주문을 취소했어요.');
			queryClient.invalidateQueries({ queryKey: ['MY_WAIT_ORDERS'] });
		},
		onError: () => {
			toast.success('주문 취소를 실패했어요');
		},
	});
	return { deleteOrder };
}
