import Lottie from 'lottie-react';
import LoadingAnimation from '@/asset/lotties/Loading.json';
function Loading() {
	return (
		<div className="w-full h-full flex items-center justify-center">
			<Lottie
				className="w-48 h-48"
				autoPlay={true}
				loop={true}
				animationData={LoadingAnimation}
			/>
		</div>
	);
}

export default Loading;
