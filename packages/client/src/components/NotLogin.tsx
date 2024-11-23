import Lottie from 'lottie-react';
import BitcoinLottie from '@asset/lotties/BitcoinLottie.json';
import { useAuth } from '@/hooks/auth/useAuth';
import { useToast } from '@/hooks/ui/useToast';

type Size = 'sm' | 'md' | 'lg';

interface NotLoginProps {
	size: Size;
}

type SizeTable = Record<
	Size,
	{
		animationCss: string;
		mainText: string;
		subText: string;
		highlightText: string;
	}
>;

function NotLogin({ size }: NotLoginProps) {
	const sizeTable: SizeTable = {
		sm: {
			animationCss: 'w-40 h-40 md:w-52 md:h-52',
			mainText: 'font-semibold text-base text-gray-800 leading-relaxed',
			subText: 'text-sm text-gray-500',
			highlightText:
				'text-sm text-blue-500 font-medium cursor-pointer hover:underline',
		},
		md: {
			animationCss: 'w-52 h-52 md:w-64 md:h-64',
			mainText: 'font-semibold text-xl text-gray-800 leading-relaxed',
			subText: 'text-sm text-gray-500',
			highlightText:
				'text-sm text-blue-500 font-medium cursor-pointer hover:underline',
		},
		lg: {
			animationCss: 'w-64 h-64 md:w-72 md:h-72',
			mainText: 'font-semibold text-2xl text-gray-800 leading-relaxed',
			subText: 'text-base text-gray-500',
			highlightText:
				'text-base text-blue-500 font-medium cursor-pointer hover:underline',
		},
	};

	const { login } = useAuth();
	const toast = useToast();
	return (
		<div className="w-full min-h-[50vh] flex flex-col justify-center items-center gap-6 p-6">
			<Lottie
				animationData={BitcoinLottie}
				loop={true}
				autoPlay={true}
				className={sizeTable[size].animationCss}
			/>
			<div className="text-center space-y-2">
				<div className={sizeTable[size].mainText}>
					로그인 후 사용 가능한 서비스에요 !
				</div>
				<p className={sizeTable[size].subText}>
					서비스 이용을 위해 로그인해 주세요
				</p>
				<p
					onClick={() => {
						login.mutate();
						toast.success('안녕하세요');
					}}
					className={sizeTable[size].highlightText}
				>
					체험 계정으로 1초 만에 시작하기 →
				</p>
			</div>
		</div>
	);
}

export default NotLogin;
