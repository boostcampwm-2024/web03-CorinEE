import OrderInput from '@/pages/trade/components/order_form/common/OrderInput';
import OrderSubmitButton from '@/pages/trade/components/order_form/common/OrderSubmitButton';
import PercentageButtons from '@/pages/trade/components/order_form/common/PercentageButtons';
import { useMyAccount } from '@/hooks/useMyAccount';
import { useOrderForm } from '@/hooks/useOrderForm';
import OrderSummary from '@/pages/trade/components/order_form/common/OrderSummary';

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

	const summaryItems = [
		{
			label: '매수 가능 금액',
			value: `${Math.floor(balance.KRW).toLocaleString()}원`,
		},
	];

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
					<OrderSummary
						price={price}
						quantity={quantity}
						summaryItems={summaryItems}
					/>
					<OrderSubmitButton type="buy" />
				</form>
			</div>
		</>
	);
}

export default OrderBuyForm;
