import { resetAccount as resetAccountAPI } from '@/api/acoount';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../ui/useToast';

export function useResetAccount() {
	const QUERY_KEY = ['RESET_KEY'];
	const queryClient = useQueryClient();
	const toast = useToast();
	const resetAccount = useMutation({
		mutationFn: resetAccountAPI,
		mutationKey: [QUERY_KEY],
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['MY_ACCOUNT'] });
			toast.success('계좌가 초기화 됐어요');
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return resetAccount;
}
