import { useState } from 'react';
import OrderInput from '@/pages/trade/components/order_form/common/OrderInput';
import OrderSubmitButton from '@/pages/trade/components/order_form/common/OrderSubmitButton';
import PercentageButtons from '@/pages/trade/components/order_form/common/PercentageButtons';
import NotLogin from '@/components/NotLogin';
import { useAuthStore } from '@/store/authStore';
function OrderBuyForm({ currentPrice }: { currentPrice: number }) {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const [price, setPrice] = useState(currentPrice);
	const [quantity, setQuantity] = useState<number>(0);
	const totalPrice = (price * quantity).toLocaleString();
	if (!isAuthenticated) return <NotLogin size="md" />;
	return (
		<div className="text-black font-normal text-sm">
			<form>
				<div className="flex flex-col gap-3">
					<OrderInput
						label="매수 가격(KRW)"
						value={price}
						onChange={setPrice}
					/>
					<OrderInput
						label="수량"
						value={quantity}
						onChange={setQuantity}
						placeholder="0"
					/>
					<PercentageButtons />
				</div>
				<div className="flex justify-between mt-5">
					<span>총 주문 금액</span>
					<span>{totalPrice}</span>
				</div>
				<OrderSubmitButton type="buy" />
			</form>
		</div>
	);
}

export default OrderBuyForm;
