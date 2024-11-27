import NotLogin from '@/components/NotLogin';
import SidebarCoin from '@/components/sidebar/SidebarCoin';
import { useSSETicker } from '@/hooks/SSE/useSSETicker';
import { useMyAccount } from '@/hooks/auth/useMyAccount';
import { useAuthStore } from '@/store/authStore';
import { formatData } from '@/utility/format/formatSSEData';
import { useMemo } from 'react';
import Lottie from 'lottie-react';
import Wallet from '@asset/lotties/Wallet.json';

function MyInvestment() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const { data } = useMyAccount();
	const balanceMarketList = useMemo(
		() =>
			data.coins.map((coin) => {
				return {
					market: `KRW-${coin.market}`,
					quantity: Number(coin.quantity),
				};
			}),
		[data.coins],
	);
	const { sseData } = useSSETicker(balanceMarketList);
	
	const formatters = formatData('KRW');

	if (!isAuthenticated) return <NotLogin size="sm" />;

	return (
		<div className="flex flex-col h-full overflow-y-auto [&::-webkit-scrollbar]:hidden p-4">
			<div>
				<span className="text-lg font-semibold">내 투자</span>
			</div>
			<div className="border border-solid border-gray-300 my-3"></div>
			{data.coins.length > 0 ? (
				data.coins.map((coin, index) => (
					<SidebarCoin
						key={coin.market}
						listNumber={index + 1}
						formatters={formatters}
						sseData={sseData}
						image_url={coin.img_url}
						korean_name={coin.koreanName}
						market={`KRW-${coin.market}`}
					/>
				))
			) : (
				<>
					<Lottie
						animationData={Wallet}
						loop={true}
						autoPlay={true}
					/>
					<p className="text-center text-gray-600 font-semibold">
						투자한 종목이 없어요 !
					</p>
				</>
			)}
		</div>
	);
}

export default MyInvestment;
