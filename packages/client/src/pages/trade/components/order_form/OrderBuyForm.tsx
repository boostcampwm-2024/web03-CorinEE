import OrderInput from '@/pages/trade/components/order_form/common/OrderInput';
import OrderSubmitButton from '@/pages/trade/components/order_form/common/OrderSubmitButton';
import PercentageButtons from '@/pages/trade/components/order_form/common/PercentageButtons';
import { calculateTotalPrice } from '@/utility/order';
import { useMyAccount } from '@/hooks/useMyAccount';
import { useOrderForm } from '@/hooks/useOrderForm';

function OrderBuyForm({ currentPrice }: { currentPrice: number }) {
	const {
		price,
		setPrice,
		quantity,
		setQuantity,
		quantityErrorMessage,
		handleSubmit,
	} = useOrderForm({ currentPrice, askType: 'bid' });

	const { data: balance } = useMyAccount();

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
