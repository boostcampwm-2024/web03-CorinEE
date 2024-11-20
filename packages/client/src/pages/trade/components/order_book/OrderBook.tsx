import AskList from '@/pages/trade/components/order_book/AskList';
import BidList from '@/pages/trade/components/order_book/BidList';
import { OrderBook as OrderBookType } from '@/types/orderbook';
import { formatAsks, formatBids } from '@/utility/format/formatOrderBookData';

type OrderBookProps = {
	orderBook: OrderBookType;
	currentPrice: number;
	handleSelectPrice: (price: number) => void;
};

function OrderBook({
	orderBook,
	currentPrice,
	handleSelectPrice,
}: OrderBookProps) {
	if (!orderBook) return;
	const asks = formatAsks(orderBook);
	const bids = formatBids(orderBook);

	return (
		<div className="bg-gray-50 flex-1 min-w-80 rounded-lg p-2 overflow-y-scroll overflow-x-hidden">
			<div className="text-sm font-semibold border-b border-solid border-gray-300 pb-2">
				호가
			</div>
			<div className="w-full flex flex-col">
				<AskList
					asks={asks}
					currentPrice={currentPrice}
					handleSelectPrice={handleSelectPrice}
				/>
				<div className="w-full h-[1px] bg-gray-300 my-2"></div>
				<BidList
					bids={bids}
					currentPrice={currentPrice}
					handleSelectPrice={handleSelectPrice}
				/>
			</div>
		</div>
	);
}

export default OrderBook;
