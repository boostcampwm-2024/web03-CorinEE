import Lottie from 'lottie-react';
import MobileInfoLottie from '@/asset/lotties/MobileNotice.json';
import { useToast } from '@/hooks/ui/useToast';

function MobileNotice() {
	const toast = useToast();
	const handleCopyLink = async () => {
		try {
			const URL = 'https://www.corinee.site/';
			await navigator.clipboard.writeText(URL);
			toast.success('코린이 PC 링크를 복사했어요');
		} catch (error) {
			toast.error('링크 복사에 실패했어요');
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-4 gap-4 overflow-x-hidden">
			<div className="bg-gradient-to-b from-blue-50 absolute top-0 w-full h-60" />
			<div className="p-6 rounded-lg max-w-md w-full text-center z-10">
				<h1 className="text-gray-800 text-2xl font-semibold mb-4 flex flex-col">
					<span>더 큰 화면으로</span>
					<span>더 자세하게 거래해요</span>
				</h1>
			</div>
			<Lottie
				animationData={MobileInfoLottie}
				className="w-96 animate-fadeIn"
			/>
			<div className="text-gray-600 mb-4 text-center">
				<p>본 서비스는 PC 환경에 최적화되어 있어요.</p>
				<p>더 나은 사용자 경험을 위해 PC로 접속해 주세요.</p>
			</div>
			<button
				className="w-11/12 text-lg py-4 rounded-lg bg-blue-600 text-white font-semibold"
				onClick={handleCopyLink}
			>
				코린이 PC 링크 복사하기
			</button>
		</div>
	);
}

export default MobileNotice;
