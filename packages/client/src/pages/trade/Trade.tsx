import Chart from '@/pages/trade/components/Chart';
import OrderBook from '@/pages/trade/components/OrderBook';
import OrderForm from '@/pages/trade/components/order_form/OrderForm';
import TradeHeader from '@/pages/trade/components/trade_header/TradeHeader';
import { useParams } from 'react-router-dom';
import { useWSTicker } from '@/hooks/useWSTicker';

function Trade() {
	const { market } = useParams();
	const { socketData } = useWSTicker([{ market: market }]);
	if (!market) return;
	if (!socketData) return;
	const currentPrice = socketData[market]?.trade_price;
	return (
		<div className="w-full h-full gap-2">
			<TradeHeader market={market} socketData={socketData} />
			<div className="flex gap-2 min-h-[700px]">
				<Chart />
				<OrderBook />
				<OrderForm currentPrice={currentPrice} />
			</div>
		</div>
	);
}

export default Trade;
