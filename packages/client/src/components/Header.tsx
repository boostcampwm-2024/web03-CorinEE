import { useAuth } from '@/hooks/useAuth';
import { Button, Navbar } from '@material-tailwind/react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

function Header() {
	const { login, logout } = useAuth();
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	return (
		<Navbar
			fullWidth={true}
			className=" flex justify-between items-center sticky top-0"
		>
			<div>
				<Link to={'/'} className="text-black">
					코린이
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
					<Button onClick={() => logout.mutate()}>로그아웃</Button>
				) : (
					<>
						<Button onClick={() => login.mutate()}>체험하기</Button>
						<Button className="mx-2">로그인</Button>
					</>
				)}
			</div>
		</Navbar>
	);
}

export default Header;
