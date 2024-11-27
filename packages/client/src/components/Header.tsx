import { useAuth } from '@/hooks/auth/useAuth';
import { Button, Navbar } from '@material-tailwind/react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { GOOGLE_AUTH_URL, KAKAO_AUTH_URL } from '@/constants/authAddress';
import { useModal } from '@/hooks/ui/useModal';
import { useToast } from '@/hooks/ui/useToast';
import logoImage from '@asset/logo/corineeLogo.png';
import kakaLogo from '@asset/logo/kakao.png';
import googleLogo from '@asset/logo/google.png';
import GuestLoginModal from '@/components/modal/GuestLoginModal';

function Header() {
	const { logout } = useAuth();
	const { open, handleOpen } = useModal();
	const location = useLocation();
	const toast = useToast();
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	const handleLogin = (param: 'kakao' | 'google') => {
		if (param === 'google') window.location.href = GOOGLE_AUTH_URL;
		else if (param === 'kakao') window.location.href = KAKAO_AUTH_URL;
	};

	const handleLogout = () => {
		logout.mutateAsync();
		toast.success('로그아웃에 성공했어요');
	};

	const isAccountPage = location.pathname.startsWith('/account');

	return (
		<>
			<Navbar
				fullWidth={true}
				className="w-full flex justify-between items-center sticky top-0 z-10 min-w-[1100px]"
				shadow={false}
			>
				<div>
					<Link to={'/'} className="flex gap-2 items-center">
						<img className="w-12 h-12" src={logoImage} />
						<h1 className="text-black text-xl font-semibold">Corinee</h1>
					</Link>
				</div>
				<div className="flex gap-4">
					<NavLink
						to={'/'}
						className={({ isActive }) =>
							`${isActive ? 'text-black font-semibold' : 'text-gray-600'} hover:text-black`
						}
					>
						홈
					</NavLink>
					<NavLink
						to={'/account/balance'}
						className={`${isAccountPage ? 'text-black font-semibold' : 'text-gray-600'} hover:text-black`}
					>
						내 계좌
					</NavLink>
				</div>
				<div className="w-[200px] flex justify-end">
					{isAuthenticated ? (
						<Button onClick={handleLogout}>로그아웃</Button>
					) : (
						<div className="flex gap-3">
							<Button onClick={handleOpen}>체험하기</Button>
							<button onClick={() => handleLogin('kakao')}>
								<img alt="kakao_image" src={kakaLogo} className="w-10 h-10" />
							</button>
							<button onClick={() => handleLogin('google')}>
								<img alt="google_image" src={googleLogo} className="w-9 h-9" />
							</button>
						</div>
					)}
				</div>
			</Navbar>
			<GuestLoginModal open={open} handleOpen={handleOpen} />
		</>
	);
}

export default Header;
