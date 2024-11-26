import { Route, Routes } from 'react-router-dom';
import Layout from '@/pages/layout/Layout';
import Home from '@/pages/home/Home';
import Account from '@/pages/account/Account';
import Trade from '@/pages/trade/Trade';
import NotFound from '@/pages/not-found/NotFound';
import Redricet from '@/pages/auth/Redirect';
import { Suspense } from 'react';
import Balance from '@/pages/account/balance/Balance';
import History from '@/pages/account/history/History';
import WaitOrders from '@/pages/account/waitOrders/WaitOrders';

function Router() {
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
				</Route>
				<Route path="/auth/callback" element={<Redricet />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Suspense>
	);
}

export default Router;
