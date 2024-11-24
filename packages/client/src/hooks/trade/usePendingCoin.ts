import { pendingCoin } from '@/api/trade';
import { useSuspenseQuery } from '@tanstack/react-query';

export function usePendingCoin(coin: string) {
	const QUERY_KEY = 'PENDING_COIN';
	const { data } = useSuspenseQuery({
		queryFn: () => pendingCoin(coin),
		queryKey: [QUERY_KEY],
		refetchOnMount: 'always',
	});

	return { data };
}
