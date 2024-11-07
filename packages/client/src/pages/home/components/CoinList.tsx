import { useWSTicker } from '@/hooks/useWSTicker';
import { MarketData } from '@/types/market';

function CoinList({ markets }: { markest: MarketData[] }) {
	const { socketData } = useWSTicker(markets);

	return (
		<div>
			{markets.map((market) => (
				<div key={market.market}>{market.korean_name}</div>
			))}
		</div>
	);
}

export default CoinList;
