import { Market } from '@/types/market';
import { MarketCategory, SideBarMenu } from '@/types/menu';

export function isSideBarMenu(value: string | null): value is SideBarMenu {
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
