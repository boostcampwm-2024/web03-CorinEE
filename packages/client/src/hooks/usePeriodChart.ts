import { getCandleByPeriod } from '@/api/market';
import { CandlePeriod } from '@/types/chart';
import { useSuspenseQuery } from '@tanstack/react-query';

export function usePeriodChart(market: string, period: CandlePeriod) {
	const { data } = useSuspenseQuery({
		queryKey: [market, period],
		queryFn: () => getCandleByPeriod(market, period),
		staleTime: 1000 * 60, // 1분
		gcTime: 1000 * 60 * 5, // 5분
	});

	return { data };
}
