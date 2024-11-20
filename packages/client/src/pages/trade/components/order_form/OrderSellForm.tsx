import OrderInput from '@/pages/trade/components/order_form/common/OrderInput';
import OrderSubmitButton from '@/pages/trade/components/order_form/common/OrderSubmitButton';
import PercentageButtons from '@/pages/trade/components/order_form/common/PercentageButtons';
import Wallet from '@/pages/trade/components/order_form/common/NoCoin';
import { calculateTotalPrice } from '@/utility/order';
import { useCheckCoin } from '@/hooks/useCheckCoin';
import { useMarketParams } from '@/hooks/market/useMarketParams';
import { useOrderForm } from '@/hooks/useOrderForm';

function OrderSellForm({ currentPrice }: { currentPrice: number }) {
	const {
		price,
		setPrice,
		quantity,
		setQuantity,
		quantityErrorMessage,
		handleSubmit,
	} = useOrderForm({ currentPrice, askType: 'ask' });
	const { code } = useMarketParams();
	const { data: checkCoin } = useCheckCoin(code);

	return (
		<>
			{!checkCoin?.own ? (
				<div>
					<Wallet />
				</div>
			) : (
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
							<span>
								{calculateTotalPrice(price, quantity).toLocaleString()}
							</span>
						</div>
						<OrderSubmitButton type="sell" />
					</form>
				</div>
			)}
		</>
	);
}

export default OrderSellForm;
