import Header from '@/components/Header';
import Sidebar from '@/components/sidebar/Sidebar';
import { Outlet } from 'react-router-dom';

function Layout() {
	return (
		<>
			<div className="flex relative h-screen overflow-x-hidden overflow-y-auto">
				<div className="w-screen flex flex-col">
					<Header />
					<div className="pt-10 px-20">
						<Outlet />
					</div>
				</div>
				<Sidebar />
			</div>
		</>
	);
}

export default Layout;
