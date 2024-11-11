import NotLogin from '@/pages/trade/components/order_form/NotLogin';
import OrderInput from '@/pages/trade/components/order_form/common/OrderInput';
import OrderSubmitButton from '@/pages/trade/components/order_form/common/OrderSubmitButton';
import PercentageButtons from '@/pages/trade/components/order_form/common/PercentageButtons';
import { useState } from 'react';
function OrderSellForm({ currentPrice }: { currentPrice: number }) {
	const [isLogin] = useState(false);
	const [price, setPrice] = useState(currentPrice);
	const [quantity, setQuantity] = useState<number>(0);
	const totalPrice = (price * quantity).toLocaleString();
	if (!isLogin) return <NotLogin />;
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
					<PercentageButtons />
				</div>
				<div className="flex justify-between mt-5">
					<span>총 주문 금액</span>
					<span>{totalPrice}</span>
				</div>
				<OrderSubmitButton type="sell" />
			</form>
		</div>
	);
}

export default OrderSellForm;
