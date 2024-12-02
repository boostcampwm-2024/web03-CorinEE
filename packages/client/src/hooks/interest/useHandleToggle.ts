import { useToggleMyInterest } from '@/hooks/interest/useToggleMyInterest';
import { useToast } from '@/hooks/ui/useToast';
import { useAuthStore } from '@/store/authStore';

export function useHandleToggle() {
	const toast = useToast();
	const { toggleInterest } = useToggleMyInterest();
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	const handleToggle = async (market: string) => {
		if (!isAuthenticated) {
			toast.info('로그인 후 이용해주세요');
			return;
		}

		if (market.split('-')[0] !== 'KRW') {
			toast.warning('관심 기능은 원화 종목만 가능합니다.');
			return;
		}
		toggleInterest.mutateAsync(market);
	};

	return { handleToggle };
}
