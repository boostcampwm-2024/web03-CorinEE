import Lottie from 'lottie-react';
import NotFoundLottie from '@/asset/lotties/NotFoud.json';
import { Link } from 'react-router-dom';
import Headers from '@/components/Header';
function NotFound() {
	return (
		<div className="flex flex-col h-screen">
			<Headers />
			<div className="h-full flex items-center justify-center">
				<Lottie animationData={NotFoundLottie} className="w-1/3"></Lottie>
				<div className="flex flex-col gap-1 justify-center text-center">
					<span className="text-2xl font-semibold text-gray-800">
						페이지를 찾지 못했어요
					</span>
					<span className="text-gray-700">
						요청하신 페이지가 존재하지 않거나, 삭제되었을 수 있어요
					</span>
					<span className="text-gray-700">
						페이지 주소가 정확한지 확인해주세요
					</span>
					<Link
						to={'/'}
						className="font-semibold bg-blue-600 text-white py-2 rounded-lg mt-10 hover:bg-blue-800"
					>
						홈으로 가기
					</Link>
				</div>
			</div>
		</div>
	);
}

export default NotFound;
