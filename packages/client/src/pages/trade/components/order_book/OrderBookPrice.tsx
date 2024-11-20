type OrderBookPriceProps = {
	currentPrice: number;
	price: number;
	rate: string;
};

function OrderBookPrice({ currentPrice, price, rate }: OrderBookPriceProps) {
	const textColor = rate.includes('-') ? 'text-blue-600' : 'text-red-500';
	const borderStyle =
		currentPrice === price ? 'border border-black border-solid' : '';

	return (
		<div
			className={`col-span-2 text-center cursor-pointer hover:bg-gray-200 ${textColor} ${borderStyle}`}
		>
			<span className="text-center flex-1 p-3">{price.toLocaleString()}</span>
			<span className="text-xs">{rate}</span>
		</div>
	);
}

export default OrderBookPrice;
