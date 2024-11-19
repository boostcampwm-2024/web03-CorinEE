import NotLogin from '@/components/NotLogin';
import OrderInput from '@/pages/trade/components/order_form/common/OrderInput';
import OrderSubmitButton from '@/pages/trade/components/order_form/common/OrderSubmitButton';
import PercentageButtons from '@/pages/trade/components/order_form/common/PercentageButtons';
import { useAuthStore } from '@/store/authStore';
import { useState, useEffect } from 'react';
import { calculateTotalPrice } from '@/utility/order';
import { FormEvent } from 'react';
import { useCheckCoin } from '@/hooks/useCheckCoin';
import { useParams } from 'react-router-dom';
import { useTrade } from '@/hooks/useTrade';
import { Market } from '@/types/market';

function OrderSellForm({ currentPrice }: { currentPrice: number }) {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const [price, setPrice] = useState(String(currentPrice));
	const [quantity, setQuantity] = useState<string>('');
	const tradeMutation = useTrade('ask');
	const [quantityErrorMessage, setQuantityErrorMessage] = useState<string>('');
	const { market } = useParams();
	const [marketType, code] = market?.split('-') ?? [];
	const { data: checkCoin } = useCheckCoin(code);

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

		tradeMutation.mutate({
			askType: 'ask',
			typeGiven: code,
			typeReceived: marketType as Market,
			receivedPrice: Number(price),
			receivedAmount: Number(quantity),
		});
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
						askType="ask"
					/>
				</div>
				<div className="flex justify-between mt-5">
					<span>총 주문 금액</span>
					<span>{calculateTotalPrice(price, quantity).toLocaleString()}</span>
				</div>
				<OrderSubmitButton type="sell" />
			</form>
		</div>
	);
}

export default OrderSellForm;
