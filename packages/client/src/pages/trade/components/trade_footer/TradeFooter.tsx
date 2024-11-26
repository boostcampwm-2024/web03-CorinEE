import { useMarketTicker } from '@/hooks/market/useMarketTicker';
import { useMarketTop20 } from '@/hooks/market/useMarketTop20';
import TradeFooterCoin from '@/pages/trade/components/trade_footer/TradeFooterCoin';

function TradeFooter() {
	const { data: coins } = useMarketTop20();
	const { data: ticker } = useMarketTicker(coins ?? []);

	const duplicatedCoins = coins ? [...coins, ...coins, ...coins, ...coins] : [];

	return (
		<div className="w-full fixed bottom-0 bg-white">
			<div className="inline-flex relative">
				<div className="flex items-center justify-center whitespace-nowrap animate-infiniteScroll">
					{duplicatedCoins?.map((coin, index) => (
						<TradeFooterCoin
							key={`${coin.market}-${index}`}
							coin={coin}
							ticker={ticker}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

export default TradeFooter;
