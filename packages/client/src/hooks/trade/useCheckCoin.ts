import { checkCoin } from '@/api/trade';
import { useSuspenseQuery } from '@tanstack/react-query';

export function useCheckCoin(coin: string) {
	const { data } = useSuspenseQuery({
		queryFn: () => checkCoin(coin),
		queryKey: ['checkCoin', coin],
		refetchOnMount: 'always',
	});

	return { data };
}
