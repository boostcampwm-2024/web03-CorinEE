import { pendingCoin } from '@/api/trade';
import { getCookie } from '@/utility/cookies';
import { useSuspenseQuery } from '@tanstack/react-query';

export function usePendingCoin(coin: string) {
	const QUERY_KEY = 'PENDING_COIN';
	const token = getCookie('access_token');
	const { data } = useSuspenseQuery({
		queryFn: () => pendingCoin(coin, token),
		queryKey: [QUERY_KEY],
		refetchOnMount: 'always',
	});

	return { data };
}
