import { getCandleByPeriod } from '@/api/market';
import { Candle, CandlePeriod, InfiniteCandle } from '@/types/chart';
import { getPeriodMs } from '@/utility/chart/chartTimeUtils';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

export function usePeriodChart(
	market: string,
	period: CandlePeriod,
	minute?: number,
) {
	const { data, fetchNextPage, hasNextPage } = useSuspenseInfiniteQuery<
		Candle[],
		Error,
		InfiniteCandle,
		[string, string, CandlePeriod, number?],
		string | undefined
	>({
		queryKey: ['candles', market, period, minute],
		queryFn: ({ pageParam }) => {
			return getCandleByPeriod(market, period, pageParam, minute);
		},
		getNextPageParam: (lastPage) => {
			if (lastPage.length === 0) return undefined;
			const oldestCandle = lastPage[lastPage.length - 1];
			return oldestCandle?.candle_date_time_utc;
		},
		initialPageParam: undefined,
		select: (data) => ({
			candles: data.pages.flat(),
			hasNextPage: data.pages[data.pages.length - 1]?.length === 200,
		}),
		refetchInterval: getPeriodMs(period, minute),
	});

	return {
		data,
		fetchNextPage,
		hasNextPage,
	};
}
