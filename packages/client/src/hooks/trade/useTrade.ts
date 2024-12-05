import { trade } from '@/api/trade';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Market } from '@/types/market';
import { useToast } from '@/hooks/ui/useToast';
import { AxiosError } from 'axios';
type TradeAPI = {
	askType: 'bid' | 'ask';
	typeGiven: Market | string;
	typeReceived: Market | string;
	receivedPrice: number;
	receivedAmount: number;
};

export function useTrade(askType: 'bid' | 'ask') {
	const toast = useToast();
	const queryClient = useQueryClient();
	const tradeMutation = useMutation({
		mutationFn: (params: TradeAPI) => trade(params),
		onSuccess: () => {
			if (askType == 'bid') {
				toast.success('매수 주문을 완료했어요');
				queryClient.refetchQueries({ queryKey: ['MY_ACCOUNT'] });
			} else toast.success('매도 주문을 완료했어요');
		},
		onError: (error: AxiosError) => {
			if (error.status === 422 && askType == 'bid') {
				toast.error('계좌 잔액이 부족해요!');
			} else if (error.status === 422 && askType == 'ask') {
				toast.error('판매할 수 있는 수량이 부족해요!');
			}
		},
	});

	return tradeMutation;
}
