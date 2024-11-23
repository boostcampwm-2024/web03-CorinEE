import { getMarketAll } from '@/api/market';
import { useSuspenseQuery } from '@tanstack/react-query';

export function useMarketAll() {
	const { data } = useSuspenseQuery({
		queryKey: ['markets'],
		queryFn: getMarketAll,
		staleTime: 1000 * 60,
		gcTime: 1000 * 60 * 5,
	});
	return { data };
}
