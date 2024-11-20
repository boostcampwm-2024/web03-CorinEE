import { calculateTotalPrice } from '@/utility/order';

interface OrderSummaryProps {
	price: string;
	quantity: string;
	summaryItems: Array<{
		label: string;
		value: string | number;
		className?: string;
	}>;
}
function OrderSummary({ price, quantity, summaryItems }: OrderSummaryProps) {
	return (
		<div className="mt-5 space-y-5">
			{summaryItems.map((item, index) => (
				<div key={index} className="flex justify-between">
					<span>{item.label}</span>
					<span className={item.className}>{item.value}</span>
				</div>
			))}
			<div className="flex justify-between">
				<span>총 주문 금액</span>
				<span>{calculateTotalPrice(price, quantity).toLocaleString()}원</span>
			</div>
		</div>
	);
}

export default OrderSummary;
