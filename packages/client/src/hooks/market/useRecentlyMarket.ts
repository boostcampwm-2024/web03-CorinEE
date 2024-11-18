import { useQuery } from '@tanstack/react-query';
import { getRecentlyMarketList } from '@/api/market';

export function useRecentlyMarketList(queryString: string) {
	const { isPending, error, data } = useQuery({
		queryKey: ['recentlyMarketList',queryString],
		queryFn: () => getRecentlyMarketList(queryString),
		staleTime: 1000 * 60, // 1분
		gcTime: 1000 * 60 * 5, // 5분
	});

	return { isPending, error, data };
}
