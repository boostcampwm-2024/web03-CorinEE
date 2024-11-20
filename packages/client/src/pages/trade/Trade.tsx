import Chart from '@/pages/trade/components/chart/Chart';
import OrderBook from '@/pages/trade/components/order_book/OrderBook';
import OrderForm from '@/pages/trade/components/order_form/OrderForm';
import TradeHeader from '@/pages/trade/components/trade_header/TradeHeader';
import { useParams } from 'react-router-dom';
import { useSSETicker } from '@/hooks/SSE/useSSETicker';
import { Suspense, useMemo, useState } from 'react';
import { useSSEOrderbook } from '@/hooks/SSE/useSSEOrderbook';
import ChartSkeleton from '@/pages/trade/components/chart/ChartSkeleton';

function Trade() {
	const { market } = useParams();
	const marketCode = useMemo(() => (market ? [{ market }] : []), [market]);
	const { sseData } = useSSETicker(marketCode);
	const { sseData: orderBook } = useSSEOrderbook(marketCode);
	const [selectPrice, setSelectPrice] = useState<number | null>(null);

	if (!market || !sseData || !orderBook) return;

	const currentPrice = sseData[market]?.trade_price;
	const handleSelectPrice = (price: number) => {
		setSelectPrice(price);
	};
	return (
		<div className="w-full gap-2">
			<TradeHeader market={market} sseData={sseData} />
			<div className="flex gap-2 max-h-[75vh] overflow-y-hidden">
				<Suspense fallback={<ChartSkeleton />}>
					<Chart market={market} />
				</Suspense>
				<OrderBook
					orderBook={orderBook[market]}
					currentPrice={currentPrice}
					handleSelectPrice={handleSelectPrice}
				/>
				<OrderForm currentPrice={currentPrice} selectPrice={selectPrice} />
			</div>
		</div>
	);
}

export default Trade;
