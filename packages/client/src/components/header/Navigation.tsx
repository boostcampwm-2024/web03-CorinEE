import { NavLink, useLocation } from 'react-router-dom';
function Navigation() {
	const location = useLocation();
	const isAccountPage = location.pathname.startsWith('/account');
	return (
		<div className="flex gap-8">
			<NavLink
				to="/"
				className={({ isActive }) =>
					`${isActive ? 'text-black font-semibold' : 'text-gray-600'} hover:text-black`
				}
			>
				홈
			</NavLink>
			<NavLink
				to="/account/balance"
				className={`${isAccountPage ? 'text-black font-semibold' : 'text-gray-600'} hover:text-black`}
			>
				내 계좌
			</NavLink>
			<NavLink
				to="/ranked"
				className={({ isActive }) =>
					`${isActive ? 'text-black font-semibold' : 'text-gray-600'} hover:text-black`
				}
			>
				랭킹
			</NavLink>
		</div>
	);
}

export default Navigation;
