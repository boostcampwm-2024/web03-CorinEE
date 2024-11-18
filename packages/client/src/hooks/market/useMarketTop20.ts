import { useQuery } from '@tanstack/react-query';
import { getMarketTop20 } from '@/api/market';

export function useMarketTop20() {
	const { isPending, error, data } = useQuery({
		queryKey: ['marketTop20'],
		queryFn: getMarketTop20,
		staleTime: 1000 * 60, // 1분
		gcTime: 1000 * 60 * 5, // 5분
	});

	return { isPending, error, data };
}
