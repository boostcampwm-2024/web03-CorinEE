import { useMarketAll } from '@/hooks/useMarketAll';

function Home() {
	const { isPending, error, data } = useMarketAll();

	if (isPending) return 'Loading...';

	if (error) return 'An error has occurred: ' + error.message;

	return <div>Home Page</div>;
}

export default Home;
