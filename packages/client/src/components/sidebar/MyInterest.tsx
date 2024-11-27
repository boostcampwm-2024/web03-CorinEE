import NotLogin from '@/components/NotLogin';
import { useMyInterest } from '@/hooks/interest/useMyInterest';
import { useAuthStore } from '@/store/authStore';
import Lottie from 'lottie-react';
import Heart from '@asset/lotties/Heart.json';
import { useRecentlyMarketList } from '@/hooks/market/useRecentlyMarket';
import { convertToQueryString } from '@/utility/api/queryString';
import { formatData } from '@/utility/format/formatSSEData';
import { useSSETicker } from '@/hooks/SSE/useSSETicker';
import SidebarCoin from '@/components/sidebar/SidebarCoin';

function MyInterest() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const myInterest = useMyInterest();
	const interestMarketList = myInterest.map((info) => info.assetName);
	const { data: viewedMarket } = useRecentlyMarketList(
		convertToQueryString(interestMarketList),
		{ 
      enabled: myInterest.length > 0 
    }
	);
	const formatters = formatData('KRW');
	const { sseData } = useSSETicker(viewedMarket || []);
	
	const sortedCoinInfos = [...viewedMarket || []].sort((a, b) => {
		const indexA = interestMarketList.indexOf(a.market);
		const indexB = interestMarketList.indexOf(b.market);
		return indexA - indexB;
	});

	if (!isAuthenticated) return <NotLogin size="sm" />;
	
	return (
		<div className="flex flex-col h-full overflow-y-auto [&::-webkit-scrollbar]:hidden p-4">
			<div>
				<span className="text-lg font-semibold">내 관심</span>
			</div>
			<div className="border border-solid border-gray-300 my-3"></div>
			{myInterest.length > 0 ? (
				sortedCoinInfos.map((coin, index) => (
					<SidebarCoin
						key={coin.market}
						listNumber={index + 1}
						formatters={formatters}
						sseData={sseData}
						image_url={coin.image_url}
						korean_name={coin.korean_name}
						market={coin.market}
					/>
				))
			) : (
				<>
					<Lottie animationData={Heart} loop={true} autoPlay={true} />
					<p className="text-center text-gray-600 font-semibold">
						관심 종목이 없어요 !
					</p>
				</>
			)}
		</div>
	);
}

export default MyInterest;
