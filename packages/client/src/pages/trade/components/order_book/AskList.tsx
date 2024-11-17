import OrderBookPrice from '@/pages/trade/components/order_book/OrderBookPrice';
import { OrderBookUnit } from '@/types/orderbook';

type AskListProps = {
	asks: Pick<OrderBookUnit, 'ask_price' | 'ask_size' | 'ask_rate'>[];
	currentPrice: number;
};

function AskList({ asks, currentPrice }: AskListProps) {
	const maxSize = Math.max(...asks.map((ask) => ask.ask_size));
	return (
		<ul className="flex flex-col w-full">
			{asks.map((ask) => (
				<li key={ask.ask_price} className="grid grid-cols-4 m-1">
					<div className="relative">
						<div
							className="absolute right-0 top-0 h-full bg-blue-100 rounded-sm"
							style={{
								width: `${(ask.ask_size / maxSize) * 100}%`,
								maxWidth: '25%', // span이 차지하는 영역까지만
							}}
						/>
						<span className="relative text-xs text-left pl-2 text-blue-600">
							{ask.ask_size.toFixed(3)}
						</span>
					</div>
					<OrderBookPrice
						currentPrice={currentPrice}
						price={ask.ask_price}
						rate={ask.ask_rate}
					/>
					<span></span>
				</li>
			))}
		</ul>
	);
}

export default AskList;
