import { Market } from '@/types/market';

export type SideBarCategory = 'MY_INVESTMENT' | 'INTEREST' | 'RECENTLY_VIEWED' | 'REALTIME' | null;

export type MarketCategory = Market | 'INTEREST' | 'OWN';

export type AccountCategory = 'BALANCE' | 'HISTORY' | 'WAIT_ORDERS'
