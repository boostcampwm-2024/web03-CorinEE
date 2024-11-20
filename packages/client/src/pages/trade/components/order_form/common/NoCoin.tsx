import Lottie from 'lottie-react';
import Wallet from '@asset/lotties/Wallet.json';
function NoCoin() {
	return (
		<div className="flex flex-col justify-center items-center">
			<Lottie
				className="w-64 h-64"
				animationData={Wallet}
				loop={true}
				autoPlay={true}
				rendererSettings={{
					preserveAspectRatio: 'xMidYMid slice',
					progressiveLoad: true,
				}}
			/>
			<div className="text-gray-700">판매할 코인이 없어요</div>
		</div>
	);
}

export default NoCoin;
