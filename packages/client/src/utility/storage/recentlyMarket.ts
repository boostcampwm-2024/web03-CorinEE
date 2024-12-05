const STORAGE_KEY = 'recently-viewed';

const getRecentlyViewedMarketList = () => {
	const stored = localStorage.getItem(STORAGE_KEY);
	if (!stored) return [];
	return JSON.parse(stored) as string[];
};

const setRecentlyViewedMarketList = (market: string) => {
	let marketList = getRecentlyViewedMarketList();
	if (marketList.includes(market)) {
		return;
	}
	marketList = [...marketList, market].slice(-10);
	localStorage.setItem(STORAGE_KEY, JSON.stringify(marketList));
};

export { getRecentlyViewedMarketList, setRecentlyViewedMarketList };
