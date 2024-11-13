import Chart from '@/pages/trade/components/chart/Chart';
import OrderBook from '@/pages/trade/components/order_book/OrderBook';
import OrderForm from '@/pages/trade/components/order_form/OrderForm';
import TradeHeader from '@/pages/trade/components/trade_header/TradeHeader';
import { useParams } from 'react-router-dom';
import { useSSETicker } from '@/hooks/useSSETicker';
import { Suspense, useMemo } from 'react';
import ChartSkeleton from '@/pages/trade/components/chart/ChartSkeleton';
import { useSSEOrderbook } from '@/hooks/useSSEOrderbook';

function Trade() {
	const { market } = useParams();
	const marketCode = useMemo(() => (market ? [{ market }] : []), [market]);
	const { sseData } = useSSETicker(marketCode);
	const { sseData: orderBook } = useSSEOrderbook(marketCode);
	if (!market) return;
	if (!sseData || !orderBook) return;

	const currentPrice = sseData[market]?.trade_price;

	return (
		<div className="w-full gap-2">
			<TradeHeader market={market} sseData={sseData} />
			<div className="flex gap-2 max-h-[75vh] overflow-y-hidden">
				<Suspense fallback={<ChartSkeleton />}>
					<Chart market={market} />
				</Suspense>
				<OrderBook orderBook={orderBook[market]} currentPrice={currentPrice} />
				<OrderForm currentPrice={currentPrice} />
			</div>
		</div>
	);
}

export default Trade;
