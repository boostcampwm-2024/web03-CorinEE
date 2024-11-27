import { lazy, Suspense } from 'react';
import NotLogin from '@/components/NotLogin';

const OrderBuyForm = lazy(
	() => import('@/pages/trade/components/order_form/forms/OrderBuyForm'),
);
const OrderSellForm = lazy(
	() => import('@/pages/trade/components/order_form/forms/OrderSellForm'),
);
const OrderWaitForm = lazy(
	() => import('@/pages/trade/components/order_form/forms/OrderWaitForm'),
);

type CreateOrderTabProsp = {
	currentPrice: number;
	selectPrice: number | null;
};

export type OrderTabItem = {
	value: string;
	id: 'buy' | 'sell' | 'wait';
	activeColor: string;
	component: JSX.Element;
	notLogin: JSX.Element;
};

export const createOrderTabs = ({
	currentPrice,
	selectPrice,
}: CreateOrderTabProsp): OrderTabItem[] => {
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
