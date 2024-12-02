import {
	getRecentlyViewedMarketList,
	setRecentlyViewedMarketList,
} from '@/utility/storage/recentlyMarket';
import { create } from 'zustand';

type RecentlyMarketStore = {
	recentlyViewedMarketList: string[];
	addRecentlyViewedMarket: (market: string) => void;
};

const useRecentlyMarketStore = create<RecentlyMarketStore>((set) => ({
	recentlyViewedMarketList: getRecentlyViewedMarketList(),

	addRecentlyViewedMarket: (market: string) => {
		// 원화 종목이 아니면 로컬 스토리지에 담기지 않게 예외 처리
		if (market.split('-')[0] !== 'KRW') return;
		setRecentlyViewedMarketList(market);

		set(() => ({
			recentlyViewedMarketList: getRecentlyViewedMarketList(),
		}));
	},
}));

export default useRecentlyMarketStore;
