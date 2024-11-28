import { useMyInterest } from '@/hooks/interest/useMyInterest';
import Lottie from 'lottie-react';
import Heart from '@asset/lotties/Heart.json';
import { useRecentlyMarketList } from '@/hooks/market/useRecentlyMarket';
import { formatData } from '@/utility/format/formatSSEData';
import { useSSETicker } from '@/hooks/SSE/useSSETicker';
import SidebarCoin from '@/components/sidebar/SidebarCoin';
import withAuthenticate from '@/components/hoc/withAuthenticate';

function MyInterest() {
	const { isLoading, data: myInterest = [] } = useMyInterest();
	const { data: viewedMarket } = useRecentlyMarketList(myInterest);
	const { sseData } = useSSETicker(viewedMarket || []);
	const interestMarketList = myInterest.map((info) => info.assetName);
	const formatters = formatData('KRW');

	const sortedCoinInfos = [...(viewedMarket || [])].sort((a, b) => {
		const indexA = interestMarketList.indexOf(a.market);
		const indexB = interestMarketList.indexOf(b.market);
		return indexA - indexB;
	});

	if (isLoading) return null;
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

export default withAuthenticate({ WrappedComponent: MyInterest, size: 'sm' });
