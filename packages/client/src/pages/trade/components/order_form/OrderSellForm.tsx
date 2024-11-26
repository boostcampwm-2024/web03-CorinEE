import OrderInput from '@/pages/trade/components/order_form/common/OrderInput';
import OrderSubmitButton from '@/pages/trade/components/order_form/common/OrderSubmitButton';
import PercentageButtons from '@/pages/trade/components/order_form/common/PercentageButtons';
import Wallet from '@/pages/trade/components/order_form/common/NoCoin';
import OrderSummary from '@/pages/trade/components/order_form/common/OrderSummary';
import { useCheckCoin } from '@/hooks/trade/useCheckCoin';
import { useMarketParams } from '@/hooks/market/useMarketParams';
import { useOrderForm } from '@/hooks/trade/useOrderForm';
import { useMyAccount } from '@/hooks/auth/useMyAccount';
import { calculateProfitInfo } from '@/utility/finance/calculateProfit';

type OrderSellFormProps = {
	currentPrice: number;
	selectPrice: number | null;
};

function OrderSellForm({ currentPrice, selectPrice }: OrderSellFormProps) {
	const {
		price,
		setPrice,
		quantity,
		setQuantity,
		quantityErrorMessage,
		handleSubmit,
	} = useOrderForm({ currentPrice, askType: 'ask', selectPrice });
	const { code } = useMarketParams();
	const { data: checkCoin } = useCheckCoin(code);
	const { data: balance } = useMyAccount();
	const targetCoin = balance.coins.find((coin) => coin.market === code)!;

	if (!targetCoin || !checkCoin?.own)
		return <Wallet message="판매할 코인이 없어요" />;

	const { profitRate, expectedProfit, isProfitable } = calculateProfitInfo(
		Number(price),
		Number(quantity),
		targetCoin,
	);

	const summaryItems = [
		{
			label: '예상 수익률',
			value: `${profitRate}%`,
			className: isProfitable ? 'text-red-500' : 'text-blue-600',
		},
		{
			label: '예상 손익',
			value: `${expectedProfit}원`,
		},
	];

	return (
		<>
			<div className="text-black font-normal text-sm">
				<form onSubmit={handleSubmit}>
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
							placeholder={`최대 ${targetCoin?.availableQuantity}개 가능`}
							errorMessage={quantityErrorMessage}
						/>
						<PercentageButtons
							price={price}
							setQuantity={setQuantity}
							askType="ask"
						/>
					</div>
					<OrderSummary
						price={price}
						quantity={quantity}
						summaryItems={summaryItems}
					/>
					<OrderSubmitButton type="sell" />
				</form>
			</div>
		</>
	);
}

export default OrderSellForm;
