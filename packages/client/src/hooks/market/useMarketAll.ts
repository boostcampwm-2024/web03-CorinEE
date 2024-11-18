import { getMarketAll } from '@/api/market';
import { useQuery } from '@tanstack/react-query';

export function useMarketAll() {
	const { isPending, error, data } = useQuery({
		queryKey: ['markets'],
		queryFn: getMarketAll,
		staleTime: 1000 * 60, // 1분
		gcTime: 1000 * 60 * 5, // 5분
	});

	return { isPending, error, data };
}
