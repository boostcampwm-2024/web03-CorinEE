import OrderBookPrice from '@/pages/trade/components/order_book/OrderBookPrice';
import { OrderBookUnit } from '@/types/orderbook';

type BidListProps = {
	bids: Pick<OrderBookUnit, 'bid_price' | 'bid_size' | 'bid_rate'>[];
	currentPrice: number;
};

function BidList({ bids, currentPrice }: BidListProps) {
	const maxSize = Math.max(...bids.map((bid) => bid.bid_size));

	return (
		<ul className="flex flex-col w-full">
			{bids.map((bid) => (
				<li key={bid.bid_price} className="grid grid-cols-4 m-1">
					<span></span>
					<OrderBookPrice
						currentPrice={currentPrice}
						price={bid.bid_price}
						rate={bid.bid_rate}
					/>
					<div className="relative">
						<div
							className="absolute left-0 top-0 h-full bg-red-100 rounded-sm"
							style={{
								width: `${(bid.bid_size / maxSize) * 100}%`,
							}}
						/>
						<span className="relative text-xs text-left pl-2 text-red-500">
							{bid.bid_size.toFixed(3)}
						</span>
					</div>
				</li>
			))}
		</ul>
	);
}

export default BidList;
