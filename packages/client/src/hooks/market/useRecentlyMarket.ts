import { useQuery } from '@tanstack/react-query';
import { getRecentlyMarketList } from '@/api/market';

export function useRecentlyMarketList(
	queryString: string,
	options?: { enabled?: boolean },
) {
	const { isPending, error, data } = useQuery({
		queryKey: ['recentlyMarketList', queryString],
		queryFn: () => getRecentlyMarketList(queryString),
		enabled: options?.enabled,
		staleTime: 1000 * 60, // 1분
		gcTime: 1000 * 60 * 5, // 5분
	});

	return { isPending, error, data };
}
