import NotLogin from '@/components/NotLogin';
import OrderInput from '@/pages/trade/components/order_form/common/OrderInput';
import OrderSubmitButton from '@/pages/trade/components/order_form/common/OrderSubmitButton';
import PercentageButtons from '@/pages/trade/components/order_form/common/PercentageButtons';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';
import { calculateTotalPrice } from '@/utility/order';
function OrderSellForm({ currentPrice }: { currentPrice: number }) {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const [price, setPrice] = useState(String(currentPrice));
	const [quantity, setQuantity] = useState<string>('');

	if (!isAuthenticated) return <NotLogin size="md" />;
	return (
		<div className="text-black font-normal text-sm">
			<form>
				<div className="flex flex-col gap-3">
					<OrderInput
						label="매도 가격(KRW)"
						value={price}
						onChange={setPrice}
					/>
					<OrderInput
						label="수량"
						value={quantity}
						onChange={setQuantity}
						placeholder="0"
					/>
					<PercentageButtons
						price={price}
						setQuantity={setQuantity}
						type="sell"
					/>
				</div>
				<div className="flex justify-between mt-5">
					<span>총 주문 금액</span>
					<span>{calculateTotalPrice(price, quantity)}</span>
				</div>
				<OrderSubmitButton type="sell" />
			</form>
		</div>
	);
}

export default OrderSellForm;
