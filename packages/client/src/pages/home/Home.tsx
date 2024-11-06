import { useMarketAll } from '@/hooks/useMarketAll';
import CoinView from '@/pages/home/components/CoinView';
import { filterCoin } from '@/utility/marketDataUtil';

function Home() {
	const { isPending, error, data } = useMarketAll();

	if (isPending) return 'Loading...';

	if (error) return 'An error has occurred: ' + error.message;

	if (data) console.log(filterCoin(data, 'USDT'));

	return <CoinView />;
}

export default Home;
