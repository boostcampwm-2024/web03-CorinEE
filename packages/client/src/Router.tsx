import { Route, Routes } from 'react-router-dom';
import Layout from '@/pages/layout/Layout';
import Home from '@/pages/home/Home';
import Account from '@/pages/account/Account';
import Trade from '@/pages/trade/Trade';
import NotFound from '@/pages/not-found/NotFound';

function Router() {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route path="/" element={<Home />} />
				<Route path="/account" element={<Account />} />
				<Route path="/trade/:market" element={<Trade />} />
			</Route>
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}

export default Router;
