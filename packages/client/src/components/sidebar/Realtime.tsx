import SidebarCoin from '@/components/sidebar/SidebarCoin';
import { useCurrentTime } from '@/hooks/useCurrentTIme';
import { useMarketTop20 } from '@/hooks/market/useMarketTop20';
import { useSSETicker } from '@/hooks/SSE/useSSETicker';
import { formatData } from '@/utility/format/formatSSEData';

function Realtime() {
	const { data: top20List } = useMarketTop20();
	const currentTime = useCurrentTime();
	const { sseData } = useSSETicker(top20List || []);
	if (!sseData || !top20List) return;
	const formatters = formatData('KRW');

	return (
		<div className="flex flex-col h-full overflow-y-auto [&::-webkit-scrollbar]:hidden p-4">
			<div>
				<span className="text-lg font-semibold">실시간 차트</span>
				<span className="ml-2 text-xs text-gray-700">
					오늘 {currentTime} 기준
				</span>
			</div>
			<div className="border border-solid border-gray-300 my-3"></div>
			{top20List?.map((coin, index) => (
				<SidebarCoin
					key={coin.market}
					listNumber={index + 1}
					formatters={formatters}
					sseData={sseData}
					{...coin}
				/>
			))}
		</div>
	);
}

export default Realtime;
