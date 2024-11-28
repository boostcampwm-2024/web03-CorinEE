import Header from '@/components/header/Header';
import Sidebar from '@/components/sidebar/Sidebar';
import { Outlet } from 'react-router-dom';

function Layout() {
	return (
		<div className="flex min-h-screen h-screen overflow-x-hidden overflow-y-auto">
			<div className="w-full flex flex-col">
				<Header />
				<main className="flex-1">
					<div className="h-full pt-5 px-20">
						<Outlet />
					</div>
				</main>
			</div>
			<div className="sticky top-0 right-0 h-screen shrink-0 overflow-visible z-20">
				<Sidebar />
			</div>
		</div>
	);
}

export default Layout;
