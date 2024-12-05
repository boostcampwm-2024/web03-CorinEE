import { searchMarket } from '@/api/market';
import { useQuery } from '@tanstack/react-query';

export function useSearchMarket(params: string) {
	const QUERY_KEY = 'SEARCH_MARKET';
	const { data, refetch, isLoading } = useQuery({
		queryFn: () => searchMarket(params),
		queryKey: [QUERY_KEY, params],
		staleTime: 1000 * 60 * 5,
		enabled: false,
	});

	return { data, refetch, isLoading };
}
