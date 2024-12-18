import { Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { useMobileBlocker } from '@/hooks/ui/useMobileBlocker';

const Layout = lazy(() => import('@/components/layout/Layout'));
const Home = lazy(() => import('@/pages/home/Home'));
const Account = lazy(() => import('@/pages/account/Account'));
const Balance = lazy(() => import('@/pages/account/balance/Balance'));
const History = lazy(() => import('@/pages/account/history/History'));
const WaitOrders = lazy(() => import('@/pages/account/waitOrders/WaitOrders'));
const Trade = lazy(() => import('@/pages/trade/Trade'));
const Redirect = lazy(() => import('@/pages/auth/Redirect'));
const NotFound = lazy(() => import('@/components/not-found/NotFound'));
const MobileNotice = lazy(() => import('@/pages/mobile/MobileNotice'));
const Ranked = lazy(() => import('@/pages/ranked/RankedList'));

function Router() {
	const isMobile = useMobileBlocker();

	if (isMobile)
		return (
			<Suspense>
				<MobileNotice />
			</Suspense>
		);

	return (
		<Suspense>
			<Routes>
				<Route element={<Layout />}>
					<Route path="/" element={<Home />} />
					<Route path="/account" element={<Account />}>
						<Route path="balance" element={<Balance />} />
						<Route path="history" element={<History />} />
						<Route path="wait_orders" element={<WaitOrders />} />
					</Route>
					<Route path="/trade/:market" element={<Trade />} />
					<Route path="/ranked" element={<Ranked />} />
				</Route>
				<Route path="/auth/callback" element={<Redirect />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Suspense>
	);
}

export default Router;
