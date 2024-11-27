import OrderInput from '@/pages/trade/components/order_form/common/OrderInput';
import OrderSubmitButton from '@/pages/trade/components/order_form/button/OrderSubmitButton';
import PercentageButtons from '@/pages/trade/components/order_form/button/PercentageButtons';
import { useMyAccount } from '@/hooks/auth/useMyAccount';
import { useOrderForm } from '@/hooks/trade/useOrderForm';
import OrderSummary from '@/pages/trade/components/order_form/common/OrderSummary';

type OrderBuyFormProsp = {
	currentPrice: number;
	selectPrice: number | null;
};

function OrderBuyForm({ currentPrice, selectPrice }: OrderBuyFormProsp) {
	const {
		price,
		setPrice,
		quantity,
		setQuantity,
		quantityErrorMessage,
		handleSubmit,
	} = useOrderForm({ currentPrice, askType: 'bid', selectPrice });

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
							value={price}
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
