import { getMarketAll } from '@/api/coin';
import { useQuery } from '@tanstack/react-query';

export function useMarketAll() {
	const { isPending, error, data } = useQuery({
		queryKey: ['markets'],
		queryFn: getMarketAll,
	});

	return { isPending, error, data };
}
