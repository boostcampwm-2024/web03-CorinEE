import { useMarketAll } from '@/hooks/market/useMarketAll';
import { useMemo } from 'react';
import { filterCoin } from '@/utility/validation/filter';
export function useValidCoin(market: string | undefined) {
	const { data } = useMarketAll();
	const KRW_Markets = useMemo(() => filterCoin(data, 'KRW'), [data]);
	const isValidCoin = useMemo(() => {
		if (!market || !KRW_Markets) return false;
		return KRW_Markets.some((item) => item.market === market);
	}, [KRW_Markets]);

	return { isValidCoin };
}
