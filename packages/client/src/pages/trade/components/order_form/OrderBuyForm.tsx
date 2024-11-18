import { useState } from 'react';
import OrderInput from '@/pages/trade/components/order_form/common/OrderInput';
import OrderSubmitButton from '@/pages/trade/components/order_form/common/OrderSubmitButton';
import PercentageButtons from '@/pages/trade/components/order_form/common/PercentageButtons';
import NotLogin from '@/components/NotLogin';
import { useAuthStore } from '@/store/authStore';
import { usePercentageBuy } from '@/hooks/usePercentageBuy';
import { calculateTotalPrice } from '@/utility/order';
function OrderBuyForm({ currentPrice }: { currentPrice: number }) {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const [price, setPrice] = useState(String(currentPrice));
	const [quantity, setQuantity] = useState<string>('');
	const { data: accountBalance } = usePercentageBuy({
		moneyType: 'KRW',
		percent: 100,
		type: 'buy',
	});

	if (!isAuthenticated) return <NotLogin size="md" />;
	return (
		<div className="text-black font-normal text-sm">
			<form>
				<div className="flex flex-col gap-3 mb-10">
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
					<PercentageButtons
						price={price}
						setQuantity={setQuantity}
						type="buy"
					/>
				</div>
				<div className="flex justify-between pt-5 border-t border-solid border-gray-500">
					<span>구매가능 금액</span>
					<span>{accountBalance?.toLocaleString()}원</span>
				</div>
				<div className="flex justify-between mt-5">
					<span>총 주문 금액</span>
					<span>{calculateTotalPrice(price, quantity)}원</span>
				</div>
				<OrderSubmitButton type="buy" />
			</form>
		</div>
	);
}

export default OrderBuyForm;
