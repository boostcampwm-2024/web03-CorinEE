import { lazy, Suspense } from 'react';
import NotLogin from '@/components/NotLogin';

const OrderBuyForm = lazy(
	() => import('@/pages/trade/components/order_form/OrderBuyForm'),
);
const OrderSellForm = lazy(
	() => import('@/pages/trade/components/order_form/OrderSellForm'),
);
const OrderWaitForm = lazy(
	() => import('@/pages/trade/components/order_form/OrderWaitForm'),
);

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
				<Suspense>
					<OrderBuyForm currentPrice={currentPrice} selectPrice={selectPrice} />
				</Suspense>
			),
			notLogin: <NotLogin size="md" />,
		},
		{
			value: '판매',
			id: 'sell',
			activeColor: 'text-blue-600',
			component: (
				<Suspense>
					<OrderSellForm
						currentPrice={currentPrice}
						selectPrice={selectPrice}
					/>
				</Suspense>
			),
			notLogin: <NotLogin size="md" />,
		},
		{
			value: '대기',
			id: 'wait',
			activeColor: 'text-green-500',
			component: (
				<Suspense>
					<OrderWaitForm />
				</Suspense>
			),
			notLogin: <NotLogin size="md" />,
		},
	] as const;
};
