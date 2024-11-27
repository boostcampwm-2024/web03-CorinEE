type OrderSubmitButtonProps = {
	type: 'buy' | 'sell';
	onClick?: () => void;
};
function OrderSubmitButton({ type, onClick }: OrderSubmitButtonProps) {
	const buttonStyle =
		type === 'buy'
			? 'bg-red-400 hover:bg-red-500'
			: 'bg-blue-600 hover:bg-blue-500';
	const text = type === 'buy' ? '구매하기' : '판매하기';

	return (
		<button
			className={`w-full h-10 rounded-md text-white mt-10 ${buttonStyle}`}
			onClick={onClick}
			type="submit"
		>
			{text}
		</button>
	);
}

export default OrderSubmitButton;
