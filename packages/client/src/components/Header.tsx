import { useAuth } from '@/hooks/auth/useAuth';
import { Button, Navbar } from '@material-tailwind/react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/ui/useToast';
import logoImage from '@asset/logo/corineeLogo.png';
import kakaLogo from '@asset/logo/kakao.png';
import googleLogo from '@asset/logo/google.png';

function Header() {
	const { guestLogin, logout } = useAuth();
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const toast = useToast();

	return (
		<>
			<Navbar
				fullWidth={true}
				className=" flex justify-between items-center sticky top-0"
				shadow={false}
			>
				<div>
					<Link to={'/'} className="flex gap-2 items-center">
						<img className="w-12 h-12" src={logoImage} />
						<h1 className="text-black text-xl font-semibold">Corinee</h1>
					</Link>
				</div>
				<div className="flex gap-4">
					<Link to={'/'} className="text-gray-600 hover:text-black">
						홈
					</Link>
					<Link to={'/account'} className="text-gray-600 hover:text-black">
						내 계좌
					</Link>
				</div>
				<div>
					{isAuthenticated ? (
						<Button
							onClick={() => {
								logout.mutateAsync();
								toast.success('로그아웃됐어요');
							}}
						>
							로그아웃
						</Button>
					) : (
						<div className="flex gap-3">
							<Button
								onClick={() => {
									guestLogin.mutateAsync();
									toast.success('안녕하세요');
								}}
							>
								체험하기
							</Button>
							<button>
								<img alt="kakao_image" src={kakaLogo} className="w-10 h-10" />
							</button>
							<button>
								<img
									alt="google_image"
									src={googleLogo}
									className="w-10 h-10"
								/>
							</button>
						</div>
					)}
				</div>
			</Navbar>
		</>
	);
}

export default Header;
