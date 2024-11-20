import OrderBookPrice from '@/pages/trade/components/order_book/OrderBookPrice';
import VolumeBar from '@/pages/trade/components/order_book/VolumeBar';
import { OrderBookUnit } from '@/types/orderbook';

type BidListProps = {
	bids: Pick<OrderBookUnit, 'bid_price' | 'bid_size' | 'bid_rate'>[];
	currentPrice: number;
	handleSelectPrice: (price: number) => void;
};

function BidList({ bids, currentPrice, handleSelectPrice }: BidListProps) {
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
						handleSelectPrice={handleSelectPrice}
					/>
					<VolumeBar
						size={bid.bid_size}
						maxSize={maxSize}
						color={'text-red-500'}
						volume_color="bg-red-100"
					/>
				</li>
			))}
		</ul>
	);
}

export default BidList;
