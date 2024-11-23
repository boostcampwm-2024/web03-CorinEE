import { calculatePercentageBuy } from '@/api/trade';
import { getCookie } from '@/utility/cookies';
import { useQuery } from '@tanstack/react-query';
import { Market } from '@/types/market';
type CalculateAPI = {
	askType: 'bid' | 'ask';
	moneyType: Market | string;
	percent: number | undefined;
};

export function usePercentageBuy({
	askType,
	moneyType,
	percent,
}: CalculateAPI) {
	const QUERY_KEY = 'percentage_buy';
	const token = getCookie('access_token');

	const { data, isLoading, refetch } = useQuery({
		queryFn: () => {
			if (percent === undefined) return null;
			return calculatePercentageBuy({ askType, moneyType, percent }, token);
		},
		queryKey: [QUERY_KEY, percent, askType],
		enabled: percent !== undefined,
		staleTime: 0,
		gcTime: 0,
	});

	return { data, isLoading, refetch };
}
