import { Footer } from '@/components/Footer';
import Header from '@/components/header/Header';
import Sidebar from '@/components/sidebar/Sidebar';
import { Outlet, useLocation } from 'react-router-dom';

function Layout() {
	const location = useLocation();
	const showFooter =
		location.pathname === '/' || location.pathname === '/ranked';
	return (
		<div className="flex min-h-screen h-screen overflow-x-hidden overflow-y-auto">
			<div className="w-full flex flex-col">
				<Header />
				<main className="pt-5 px-20 flex-[1]">
					<Outlet />
				</main>
				{showFooter && <Footer />}
			</div>
			<div className="sticky top-0 right-0 overflow-visible z-20">
				<Sidebar />
			</div>
		</div>
	);
}

export default Layout;
