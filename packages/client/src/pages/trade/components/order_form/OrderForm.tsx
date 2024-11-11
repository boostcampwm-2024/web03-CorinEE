import OrderBuyForm from '@/pages/trade/components/order_form/OrderBuyForm';
import OrderSellForm from '@/pages/trade/components/order_form/OrderSellForm';
import OrderWaitForm from '@/pages/trade/components/order_form/OrderWaitForm';
import {
	Tabs,
	Tab,
	TabsHeader,
	TabsBody,
	TabPanel,
} from '@material-tailwind/react';
import { useState } from 'react';

function OrderForm({ currentPrice }: { currentPrice: number }) {
	const [activeTabs, setActiveTabs] = useState('buy');

	const handleActiveTabs = (value: string) => {
		setActiveTabs(value);
	};

	const TABS = [
		{
			value: '구매',
			id: 'buy',
			activeColor: 'text-red-500',
			component: <OrderBuyForm currentPrice={currentPrice} />,
		},
		{
			value: '판매',
			id: 'sell',
			activeColor: 'text-blue-600',
			component: <OrderSellForm currentPrice={currentPrice} />,
		},
		{
			value: '대기',
			id: 'wait',
			activeColor: 'text-green-500',
			component: <OrderWaitForm />,
		},
	];

	return (
		<div className="bg-gray-50 w-1/3 min-w-96 rounded-lg p-2">
			<div className="text-sm font-semibold">주문하기</div>
			<Tabs value={TABS[0].value}>
				<TabsHeader className="w-full flex bg-gray-200 rounded-lg mt-3">
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
				<TabsBody
					animate={{
						initial: { y: 250 },
						mount: { y: 0 },
						unmount: { y: 250 },
					}}
				>
					{TABS.map((tab) => (
						<TabPanel key={tab.id} value={tab.value}>
							{tab.component}
						</TabPanel>
					))}
				</TabsBody>
			</Tabs>
		</div>
	);
}

export default OrderForm;
