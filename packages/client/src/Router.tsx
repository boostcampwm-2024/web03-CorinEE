import { Route, Routes } from 'react-router-dom';
import Layout from '@/pages/layout/Layout';
import Home from '@/pages/home/Home';
import Account from '@/pages/account/Account';
import Trade from '@/pages/trade/Trade';
import NotFound from '@/pages/not-found/NotFound';
import Redricet from '@/pages/auth/Redirect';
import { Suspense } from 'react';

function Router() {
	return (
		<Suspense>
			<Routes>
				<Route element={<Layout />}>
					<Route path="/" element={<Home />} />
					<Route path="/account" element={<Account />} />
					<Route path="/trade/:market" element={<Trade />} />
				</Route>
				<Route path="/auth/callback" element={<Redricet />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Suspense>
	);
}

export default Router;
