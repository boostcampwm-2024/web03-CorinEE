import NotLogin from '@/components/NotLogin';
import OrderInput from '@/pages/trade/components/order_form/common/OrderInput';
import OrderSubmitButton from '@/pages/trade/components/order_form/common/OrderSubmitButton';
import PercentageButtons from '@/pages/trade/components/order_form/common/PercentageButtons';
import { useAuthStore } from '@/store/authStore';
import { useState, useEffect } from 'react';
import { calculateTotalPrice } from '@/utility/order';
import { FormEvent } from 'react';

function OrderSellForm({ currentPrice }: { currentPrice: number }) {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const [price, setPrice] = useState(String(currentPrice));
	const [quantity, setQuantity] = useState<string>('');
	const [quantityErrorMessage, setQuantityErrorMessage] = useState<string>('');

	useEffect(() => {
		if (quantityErrorMessage) {
			const timer = setTimeout(() => {
				setQuantityErrorMessage('');
			}, 1500);

			return () => clearTimeout(timer);
		}
	}, [quantityErrorMessage]);

	if (!isAuthenticated) return <NotLogin size="md" />;

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (quantity === '' || !quantity) {
			setQuantityErrorMessage('수량을 입력해주세요');
			return;
		}
	};

	return (
		<div className="text-black font-normal text-sm">
			<form onSubmit={handleSubmit}>
				<div className="flex flex-col gap-3">
					<OrderInput
						label="매도 가격(KRW)"
						value={Number(price).toLocaleString()}
						onChange={setPrice}
					/>
					<OrderInput
						label="수량"
						value={quantity}
						onChange={setQuantity}
						placeholder="0"
						errorMessage={quantityErrorMessage}
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
