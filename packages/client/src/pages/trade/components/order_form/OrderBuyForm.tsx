import { useEffect, useState } from 'react';
import OrderInput from '@/pages/trade/components/order_form/common/OrderInput';
import OrderSubmitButton from '@/pages/trade/components/order_form/common/OrderSubmitButton';
import PercentageButtons from '@/pages/trade/components/order_form/common/PercentageButtons';
import NotLogin from '@/components/NotLogin';
import { useAuthStore } from '@/store/authStore';
import { calculateTotalPrice } from '@/utility/order';
import { FormEvent } from 'react';

function OrderBuyForm({ currentPrice }: { currentPrice: number }) {
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
				<div className="flex flex-col gap-3 mb-10">
					<OrderInput
						label="매수 가격(KRW)"
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
						type="buy"
					/>
				</div>
				<div className="flex justify-between mt-5">
					<span>총 주문 금액</span>
					<span>{calculateTotalPrice(price, quantity).toLocaleString()}원</span>
				</div>
				<OrderSubmitButton type="buy" />
			</form>
		</div>
	);
}

export default OrderBuyForm;
