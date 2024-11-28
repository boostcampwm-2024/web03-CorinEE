import { lazy, Suspense } from 'react';
import withAuthenticate from '@/components/hoc/withAuthenticate';

const OrderBuyForm = lazy(
	() => import('@/pages/trade/components/order_form/forms/OrderBuyForm'),
);
const OrderSellForm = lazy(
	() => import('@/pages/trade/components/order_form/forms/OrderSellForm'),
);
const OrderWaitForm = lazy(
	() => import('@/pages/trade/components/order_form/forms/OrderWaitForm'),
);

const AuthenticatedBuyForm = withAuthenticate({
	WrappedComponent: OrderBuyForm,
	size: 'md',
});
const AuthenticatedSellForm = withAuthenticate({
	WrappedComponent: OrderSellForm,
	size: 'md',
});
const AuthenticatedWaitForm = withAuthenticate({
	WrappedComponent: OrderWaitForm,
	size: 'md',
});

type CreateOrderTabProsp = {
	currentPrice: number;
	selectPrice: number | null;
};

export type OrderTabItem = {
	value: string;
	id: 'buy' | 'sell' | 'wait';
	activeColor: string;
	component: JSX.Element;
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
					<AuthenticatedBuyForm
						currentPrice={currentPrice}
						selectPrice={selectPrice}
					/>
				</Suspense>
			),
		},
		{
			value: '판매',
			id: 'sell',
			activeColor: 'text-blue-600',
			component: (
				<Suspense>
					<AuthenticatedSellForm
						currentPrice={currentPrice}
						selectPrice={selectPrice}
					/>
				</Suspense>
			),
		},
		{
			value: '대기',
			id: 'wait',
			activeColor: 'text-green-500',
			component: (
				<Suspense>
					<AuthenticatedWaitForm />
				</Suspense>
			),
		},
	] as const;
};
