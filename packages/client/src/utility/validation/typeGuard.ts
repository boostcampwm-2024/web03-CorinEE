import { Market } from '@/types/market';
import { MarketCategory, SideBarCategory } from '@/types/category';

export function isSideBarMenu(value: string | null): value is SideBarCategory {
	return (
		value === 'REALTIME' ||
		value === 'INTEREST' ||
		value === 'MY_INVESTMENT' ||
		value === 'RECENTLY_VIEWED' ||
		value === null
	);
}

export function isMarket(value: MarketCategory): value is Market {
	return value === 'KRW' || value === 'BTC' || value === 'USDT';
}
