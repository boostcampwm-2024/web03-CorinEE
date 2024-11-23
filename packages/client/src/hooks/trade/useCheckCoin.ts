import { checkCoin } from '@/api/trade';
import { getCookie } from '@/utility/cookies';
import { useSuspenseQuery } from '@tanstack/react-query';

export function useCheckCoin(coin: string) {
	const token = getCookie('access_token');
	const { data } = useSuspenseQuery({
		queryFn: () => checkCoin(coin, token),
		queryKey: ['checkCoin', coin],
		refetchOnMount: 'always',
	});

	return { data };
}
