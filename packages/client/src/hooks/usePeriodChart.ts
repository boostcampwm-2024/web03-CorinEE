import { getCandleByPeriod } from '@/api/market';
<<<<<<< HEAD
import { Candle, CandlePeriod, InfiniteCandle } from '@/types/chart';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
=======
import { CandlePeriod } from '@/types/chart';
import { useSuspenseQuery } from '@tanstack/react-query';
>>>>>>> 9ed63c1 (refactor: 타입명 명확히 수정)

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
	});

	return {
		data,
		fetchNextPage,
		hasNextPage,
	};
}
