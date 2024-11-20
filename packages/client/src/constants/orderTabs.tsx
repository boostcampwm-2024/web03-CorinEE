import OrderBuyForm from '@/pages/trade/components/order_form/OrderBuyForm';
import OrderSellForm from '@/pages/trade/components/order_form/OrderSellForm';
import OrderWaitForm from '@/pages/trade/components/order_form/OrderWaitForm';
import NotLogin from '@/components/NotLogin';

type CreateOrderTabProsp = {
	currentPrice: number;
	selectPrice: number | null;
};

export const createOrderTabs = ({
	currentPrice,
	selectPrice,
}: CreateOrderTabProsp) => {
	return [
		{
			value: '구매',
			id: 'buy',
			activeColor: 'text-red-500',
			component: (
				<OrderBuyForm currentPrice={currentPrice} selectPrice={selectPrice} />
			),
			notLogin: <NotLogin size="md" />,
		},
		{
			value: '판매',
			id: 'sell',
			activeColor: 'text-blue-600',
			component: (
				<OrderSellForm currentPrice={currentPrice} selectPrice={selectPrice} />
			),
			notLogin: <NotLogin size="md" />,
		},
		{
			value: '대기',
			id: 'wait',
			activeColor: 'text-green-500',
			component: <OrderWaitForm />,
			notLogin: <NotLogin size="md" />,
		},
	] as const;
};
