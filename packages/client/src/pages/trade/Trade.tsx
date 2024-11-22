import Chart from '@/pages/trade/components/chart/Chart';
import OrderBook from '@/pages/trade/components/order_book/OrderBook';
import OrderForm from '@/pages/trade/components/order_form/OrderForm';
import TradeHeader from '@/pages/trade/components/trade_header/TradeHeader';
import { useParams } from 'react-router-dom';
import { useSSETicker } from '@/hooks/SSE/useSSETicker';
import { Suspense, useMemo, useState } from 'react';
import ChartSkeleton from '@/pages/trade/components/chart/ChartSkeleton';

function Trade() {
	const { market } = useParams();
	const marketCode = useMemo(() => (market ? [{ market }] : []), [market]);
	const { sseData: price } = useSSETicker(marketCode);
	const [selectPrice, setSelectPrice] = useState<number | null>(null);

	if (!market || !price) return;

	const currentPrice = price[market]?.trade_price;
	const handleSelectPrice = (price: number) => {
		setSelectPrice(price);
	};
	return (
		<div className="w-full gap-2">
			<TradeHeader market={market} sseData={price} />
			<div className="flex gap-2 max-h-[75vh] overflow-y-hidden">
				<Suspense fallback={<ChartSkeleton />}>
					<Chart market={market} />
				</Suspense>
				<OrderBook
					currentPrice={currentPrice}
					marketCode={marketCode}
					handleSelectPrice={handleSelectPrice}
				/>
				<OrderForm currentPrice={currentPrice} selectPrice={selectPrice} />
			</div>
		</div>
	);
}

export default Trade;
