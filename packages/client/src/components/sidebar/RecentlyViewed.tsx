import SidebarCoin from '@/components/sidebar/SidebarCoin';
import { useSSETicker } from '@/hooks/useSSETicker';
import { formatData } from '@/utility/format/formatSSEData';
import useRecentlyMarketStore from '@/store/recentlyViewed';
import { useRecentlyMarket } from '@/hooks/useRecentlyMarket';
import { convertToQueryString } from '@/utility/queryString';

function RecentlyViewed() {
	const { recentlyViewedMarketList } = useRecentlyMarketStore();
	const { data: viewedMarket } = useRecentlyMarket(
		convertToQueryString(recentlyViewedMarketList),
	);
	const { sseData } = useSSETicker(viewedMarket || []);

	if (!sseData || !viewedMarket) return;

	const formatters = formatData('KRW');

	return (
		<div className="flex flex-col h-full overflow-y-auto [&::-webkit-scrollbar]:hidden p-4">
			<div>
				<span className="text-lg font-semibold">최근 본 종목</span>
				<span className="ml-2 text-xs text-gray-700">10개 종목만 표시</span>
			</div>
			<div className="border border-solid border-gray-300 my-3"></div>
			{recentlyViewedMarketList.length !== 0
				? viewedMarket.map((coin, index) => (
						<SidebarCoin
							key={coin.market}
							listNumber={index + 1}
							formatters={formatters}
							sseData={sseData}
							{...coin}
						/>
					))
				: '최근 본 항목이 없어요'}
		</div>
	);
}

export default RecentlyViewed;
