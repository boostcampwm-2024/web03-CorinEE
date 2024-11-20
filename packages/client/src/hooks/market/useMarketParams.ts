import { useParams } from 'react-router-dom';
import { Market } from '@/types/market';

interface MarketParams {
	marketType: Market;
	code: string;
	market: string;
}

export function useMarketParams(): MarketParams {
	const { market } = useParams<{ market: string }>();
	const [marketType, code] = market?.split('-') ?? [];

	return {
		marketType: marketType as Market,
		code,
		market: market ?? '',
	};
}
