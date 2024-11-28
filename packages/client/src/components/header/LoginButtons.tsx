import { Button } from '@material-tailwind/react';
import { useModal } from '@/hooks/ui/useModal';
import { GOOGLE_AUTH_URL, KAKAO_AUTH_URL } from '@/constants/authAddress';
import kakaLogo from '@asset/logo/kakao.png';
import googleLogo from '@asset/logo/google.png';
import GuestLoginModal from '@/components/modal/GuestLoginModal';

function LoginButtons() {
	const { open: guestModalOpen, handleOpen: handleGuestModal } = useModal();

	const handleLogin = (provider: 'kakao' | 'google') => {
		const authUrls = {
			google: GOOGLE_AUTH_URL,
			kakao: KAKAO_AUTH_URL,
		};
		window.location.href = authUrls[provider];
	};

	return (
		<div className="flex gap-3">
			<Button onClick={handleGuestModal}>체험하기</Button>
			<button onClick={() => handleLogin('kakao')}>
				<img alt="카카오 로그인" src={kakaLogo} className="w-10 h-10" />
			</button>
			<button onClick={() => handleLogin('google')}>
				<img alt="구글 로그인" src={googleLogo} className="w-9 h-9" />
			</button>
			<GuestLoginModal open={guestModalOpen} handleOpen={handleGuestModal} />
		</div>
	);
}

export default LoginButtons;
