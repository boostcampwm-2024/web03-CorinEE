import { useMarketTicker } from '@/hooks/market/useMarketTicker';
import { useMarketTop20 } from '@/hooks/market/useMarketTop20';
import TradeFooterCoin from '@/pages/trade/components/trade_footer/TradeFooterCoin';

function TradeFooter() {
	const { data: coins } = useMarketTop20();
	const { data: ticker } = useMarketTicker(coins ?? []);

	const duplicatedCoins = coins ? [...coins, ...coins, ...coins, ...coins] : [];

	return (
		<div className="h-10 bg-white translate-y-14">
			<div className="flex whitespace-nowrap animate-infiniteScroll">
				{duplicatedCoins?.map((coin, index) => (
					<TradeFooterCoin
						key={`${coin.market}-${index}`}
						coin={coin}
						ticker={ticker}
					/>
				))}
			</div>
		</div>
	);
}

export default TradeFooter;
