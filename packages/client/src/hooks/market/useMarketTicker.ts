import { getMarketTicker } from '@/api/market';
import { useSuspenseQuery } from '@tanstack/react-query';

export function useMarketTicker(targetMarketCodes: { market: string }[]) {
	const queryString = targetMarketCodes
		.map((code) => `coins=${encodeURIComponent(code.market)}`)
		.join('&');

	const { data } = useSuspenseQuery({
		queryFn: () => getMarketTicker(queryString),
		queryKey: ['MARKETS_TICKER', queryString],
	});

	return { data };
}
