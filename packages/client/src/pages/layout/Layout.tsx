import Header from '@/components/Header';
import Sidebar from '@/components/sidebar/Sidebar';
import { Outlet } from 'react-router-dom';

function Layout() {
	return (
		<>
			<div className="flex">
				<div className="w-screen flex flex-col flex-1">
					<Header />
					<Outlet />
				</div>
				<Sidebar />
			</div>
		</>
	);
}

export default Layout;
