import {
	getRecentlyViewedMarketList,
	setRecentlyViewedMarketList,
} from '@/utility/recentlyMarket';
import { create } from 'zustand';

type RecentlyMarketStore = {
	recentlyViewedMarketList: string[];
	addRecentlyViewedMarket: (market: string) => void;
};

const useRecentlyMarketStore = create<RecentlyMarketStore>((set) => ({
	recentlyViewedMarketList: getRecentlyViewedMarketList(),

	addRecentlyViewedMarket: (market: string) => {
		setRecentlyViewedMarketList(market);

		set(() => ({
			recentlyViewedMarketList: getRecentlyViewedMarketList(),
		}));
	},
}));

export default useRecentlyMarketStore;
