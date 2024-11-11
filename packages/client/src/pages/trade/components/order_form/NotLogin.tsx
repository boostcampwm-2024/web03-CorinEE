import Lottie from 'lottie-react';
import BitcoinLottie from '@asset/lotties/BitcoinLottie.json';

function NotLogin() {
	return (
		<div className="w-full min-h-[50vh] flex flex-col justify-center items-center gap-6 p-6">
			<Lottie
				animationData={BitcoinLottie}
				loop={true}
				autoPlay={true}
				className="w-52 h-52 md:w-64 md:h-64" // 반응형 크기
			/>
			<div className="text-center space-y-2">
				<div className="font-semibold text-xl text-gray-800 leading-relaxed">
					로그인 후 사용 가능한 서비스에요!
				</div>
				<p className="text-sm text-gray-500">
					서비스 이용을 위해 로그인해 주세요
				</p>
			</div>
		</div>
	);
}

export default NotLogin;
