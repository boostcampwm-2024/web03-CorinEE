import { Button, Navbar } from '@material-tailwind/react';
import { Link } from 'react-router-dom';

function Header() {
	return (
		<Navbar fullWidth={true} className="flex justify-between items-center">
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
				<Button>로그인</Button>
			</div>
		</Navbar>
	);
}

export default Header;
