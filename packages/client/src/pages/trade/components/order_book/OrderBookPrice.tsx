type OrderBookPriceProps = {
	currentPrice: number;
	price: number;
	rate: string;
	handleSelectPrice: (price: number) => void;
};

function OrderBookPrice({
	currentPrice,
	price,
	rate,
	handleSelectPrice,
}: OrderBookPriceProps) {
	const textColor = rate.includes('-') ? 'text-blue-600' : 'text-red-500';
	const borderStyle =
		currentPrice === price ? 'border border-black border-solid' : '';

	return (
		<div
			className={`col-span-2 text-center cursor-pointer hover:bg-gray-200 ${textColor} ${borderStyle}`}
		>
			<span
				className="text-center flex-1 p-3"
				onClick={() => handleSelectPrice(price)}
			>
				{price.toLocaleString()}
			</span>
			<span className="text-xs">{rate}</span>
		</div>
	);
}

export default OrderBookPrice;
