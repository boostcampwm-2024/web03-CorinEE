import { calculatePercentageBuy } from '@/api/trade';
import { getCookie } from '@/utility/cookies';
import { useQuery } from '@tanstack/react-query';
import { Market } from '@/types/market';
type CalculateAPI = {
	moneyType: Market;
	percent: number | undefined;
};

export function usePercentageBuy({ moneyType, percent }: CalculateAPI) {
	const QUERY_KEY = 'percentage_buy';
	const token = getCookie('access_token');
	const { data, isLoading, refetch } = useQuery({
		queryFn: () => {
			if (percent === undefined) return null;
			return calculatePercentageBuy({ moneyType, percent }, token);
		},
		queryKey: [QUERY_KEY, percent],
		enabled: percent !== undefined,
	});

	return { data, isLoading, refetch };
}
