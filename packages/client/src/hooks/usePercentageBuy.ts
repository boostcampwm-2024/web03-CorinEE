import { calculatePercentageBuy } from '@/api/trade';
import { getCookie } from '@/utility/cookies';
import { useQuery } from '@tanstack/react-query';
import { Market } from '@/types/market';
type CalculateAPI = {
	moneyType: Market;
	percent: number | undefined;
	type: 'buy' | 'sell';
};

export function usePercentageBuy({ moneyType, percent, type }: CalculateAPI) {
	const QUERY_KEY = 'percentage_buy';
	const token = getCookie('access_token');
	const { data, isLoading, refetch } = useQuery({
		queryFn: () => {
			if (percent === undefined) return null;
			if (type === 'buy')
				return calculatePercentageBuy({ moneyType, percent }, token);
			else if (type === 'sell') return null;
		},
		queryKey: [QUERY_KEY, percent, type],
		enabled: percent !== undefined,
	});

	return { data, isLoading, refetch };
}
