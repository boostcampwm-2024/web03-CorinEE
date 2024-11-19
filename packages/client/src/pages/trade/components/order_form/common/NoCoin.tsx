import Lottie from 'lottie-react';
import CoinFlyLottie from '@asset/lotties/CoinFlyLottie.json';
function NoCoin() {
	return (
		<div className="flex flex-col justify-center items-center">
			<Lottie
				className="w-64 h-64"
				animationData={CoinFlyLottie}
				loop={true}
				autoPlay={true}
			/>
			<div className="text-gray-700">판매할 코인이 없어요</div>
		</div>
	);
}

export default NoCoin;
