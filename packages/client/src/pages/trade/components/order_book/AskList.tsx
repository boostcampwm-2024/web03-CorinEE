import OrderBookPrice from '@/pages/trade/components/order_book/OrderBookPrice';
import { OrderBookUnit } from '@/types/orderbook';
import VolumeBar from '@/pages/trade/components/order_book/VolumeBar';
type AskListProps = {
	asks: Pick<OrderBookUnit, 'ask_price' | 'ask_size' | 'ask_rate'>[];
	currentPrice: number;
	handleSelectPrice: (price: number) => void;
};

function AskList({ asks, currentPrice, handleSelectPrice }: AskListProps) {
	const maxSize = Math.max(...asks.map((ask) => ask.ask_size));
	return (
		<ul className="flex flex-col w-full bg-blue-100 bg-opacity-10">
			{asks.map((ask) => (
				<li key={ask.ask_price} className="grid grid-cols-4 m-1">
					<VolumeBar
						size={ask.ask_size}
						maxSize={maxSize}
						color="text-blue-500"
						volume_color="bg-blue-100"
					/>
					<OrderBookPrice
						currentPrice={currentPrice}
						price={ask.ask_price}
						rate={ask.ask_rate}
						handleSelectPrice={handleSelectPrice}
					/>
					<span></span>
				</li>
			))}
		</ul>
	);
}

export default AskList;
