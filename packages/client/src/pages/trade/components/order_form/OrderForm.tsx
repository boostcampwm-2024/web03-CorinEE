import OrderBuyForm from '@/pages/trade/components/order_form/OrderBuyForm';
import OrderSellForm from '@/pages/trade/components/order_form/OrderSellForm';
import OrderWaitForm from '@/pages/trade/components/order_form/OrderWaitForm';
import { Tabs, Tab, TabsHeader } from '@material-tailwind/react';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import NotLogin from '@/components/NotLogin';

function OrderForm({ currentPrice }: { currentPrice: number }) {
	const [activeTabs, setActiveTabs] = useState('buy');
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const handleActiveTabs = (value: string) => {
		setActiveTabs(value);
	};

	const TABS = [
		{
			value: '구매',
			id: 'buy',
			activeColor: 'text-red-500',
			component: <OrderBuyForm currentPrice={currentPrice} />,
			notLogin: <NotLogin size="md" />,
		},
		{
			value: '판매',
			id: 'sell',
			activeColor: 'text-blue-600',
			component: <OrderSellForm currentPrice={currentPrice} />,
			notLogin: <NotLogin size="md" />,
		},
		{
			value: '대기',
			id: 'wait',
			activeColor: 'text-green-500',
			component: <OrderWaitForm />,
			notLogin: <NotLogin size="md" />,
		},
	];

	return (
		<div className="bg-gray-50 flex-1 rounded-lg p-2 min-w-80">
			<div className="text-sm font-semibold">주문하기</div>
			<Tabs value={TABS[0].value} className="z-0">
				<TabsHeader className="w-full flex bg-gray-200 rounded-lg mt-3 z-0">
					{TABS.map((tab) => (
						<Tab
							key={tab.id}
							value={tab.value}
							onClick={() => handleActiveTabs(tab.id)}
							className={`text-sm py-2 ${activeTabs === tab.id ? tab.activeColor : 'text-gray-600'}`}
						>
							{tab.value}
						</Tab>
					))}
				</TabsHeader>
				<div className="mt-4">
					{TABS.map((tab) => (
						<div
							key={tab.id}
							className={activeTabs === tab.id ? 'block' : 'hidden'}
						>
							{isAuthenticated ? tab.component : tab.notLogin}
						</div>
					))}
				</div>
			</Tabs>
		</div>
	);
}

export default OrderForm;
