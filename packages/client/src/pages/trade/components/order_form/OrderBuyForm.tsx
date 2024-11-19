import { useEffect, useState } from 'react';
import OrderInput from '@/pages/trade/components/order_form/common/OrderInput';
import OrderSubmitButton from '@/pages/trade/components/order_form/common/OrderSubmitButton';
import PercentageButtons from '@/pages/trade/components/order_form/common/PercentageButtons';
import NotLogin from '@/components/NotLogin';
import { useAuthStore } from '@/store/authStore';
import { calculateTotalPrice } from '@/utility/order';
import { FormEvent } from 'react';
import { useTrade } from '@/hooks/useTrade';
import { useParams } from 'react-router-dom';
import { Market } from '@/types/market';
import { useMyAccount } from '@/hooks/useMyAccount';

function OrderBuyForm({ currentPrice }: { currentPrice: number }) {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const [price, setPrice] = useState(String(currentPrice));
	const [quantity, setQuantity] = useState<string>('');
	const tradeMutation = useTrade('bid');
	const { data: balance } = useMyAccount();
	const { market } = useParams();
	const [marketType, code] = market?.split('-') ?? [];
	const [quantityErrorMessage, setQuantityErrorMessage] = useState<string>('');

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (quantity === '' || !quantity || !Number(quantity)) {
			setQuantityErrorMessage('수량을 입력해주세요');
			return;
		}

		tradeMutation.mutate({
			askType: 'bid',
			typeGiven: marketType as Market,
			typeReceived: code,
			receivedPrice: Number(price),
			receivedAmount: Number(quantity),
		});
	};

	useEffect(() => {
		if (quantityErrorMessage) {
			const timer = setTimeout(() => {
				setQuantityErrorMessage('');
			}, 1500);

			return () => clearTimeout(timer);
		}
	}, [quantityErrorMessage]);

	if (!isAuthenticated) return <NotLogin size="md" />;

	return (
		<>
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
							askType="bid"
						/>
					</div>
					<div className="flex justify-between mt-5">
						<span>매수 가능 금액</span>
						<span>{Math.floor(balance.KRW).toLocaleString()}원</span>
					</div>
					<div className="flex justify-between mt-5">
						<span>총 주문 금액</span>
						<span>
							{calculateTotalPrice(price, quantity).toLocaleString()}원
						</span>
					</div>
					<OrderSubmitButton type="buy" />
				</form>
			</div>
		</>
	);
}

export default OrderBuyForm;
