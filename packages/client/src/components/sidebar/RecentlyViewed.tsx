import SidebarCoin from '@/components/sidebar/SidebarCoin';
import { useSSETicker } from '@/hooks/SSE/useSSETicker';
import { formatData } from '@/utility/format/formatSSEData';
import useRecentlyMarketStore from '@/store/recentlyViewed';
import { useRecentlyMarketList } from '@/hooks/market/useRecentlyMarket';
import { convertToQueryString } from '@/utility/api/queryString';
import { SidebarMarketData } from '@/types/market';

function RecentlyViewed() {
	const { recentlyViewedMarketList } = useRecentlyMarketStore();

	const { data: viewedMarket } = useRecentlyMarketList(
		convertToQueryString(recentlyViewedMarketList),
	);

	const { sseData } = useSSETicker(viewedMarket || []);

	if (!sseData || !viewedMarket) {
		return (
			<div className="flex flex-col h-full overflow-y-auto [&::-webkit-scrollbar]:hidden p-4">
				<div>
					<span className="text-lg font-semibold">최근 본 종목</span>
					<span className="ml-2 text-xs text-gray-700">
						10개 <span className="font-bold">원화</span> 종목만 표시
					</span>
				</div>
				<div className="border border-solid border-gray-300 my-3"></div>
			</div>
		);
	}

	const sortedViewedMarketData = recentlyViewedMarketList
		.map((marketName) =>
			viewedMarket.find((item) => item.market === marketName),
		)
		.filter((item): item is SidebarMarketData => item !== undefined);

	const formatters = formatData('KRW');

	return (
		<div className="flex flex-col h-full overflow-y-auto [&::-webkit-scrollbar]:hidden p-4">
			<div>
				<span className="text-lg font-semibold">최근 본 종목</span>
				<span className="ml-2 text-xs text-gray-700">
					10개 <span className="font-bold">원화</span> 종목만 표시
				</span>
			</div>
			<div className="border border-solid border-gray-300 my-3"></div>
			{recentlyViewedMarketList.length !== 0
				? sortedViewedMarketData.map((coin, index) => (
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
