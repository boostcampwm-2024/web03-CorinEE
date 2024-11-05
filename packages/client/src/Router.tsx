import { Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Account from './pages/account';
import Layout from './pages/layout';
import NotFound from './pages/not-found';
import Trade from './pages/trade';

function Router() {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route path="/" element={<Home />} />
				<Route path="/account" element={<Account />} />
				<Route path="/trade/*" element={<Trade />} />
			</Route>
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}

export default Router;
