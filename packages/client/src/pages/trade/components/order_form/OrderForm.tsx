import OrderTabs from '@/pages/trade/components/order_form/tabs/OrderTabs';
import { useState } from 'react';
import { createOrderTabs } from '@/constants/orderTabs';
import OrderTabContents from '@/pages/trade/components/order_form/tabs/OrderTabContents';

type OrderFormProps = {
	currentPrice: number;
	selectPrice: number | null;
};

function OrderForm({ currentPrice, selectPrice }: OrderFormProps) {
	const [activeTab, setActiveTab] = useState<'buy' | 'sell' | 'wait'>('buy');
	const TABS = createOrderTabs({ currentPrice, selectPrice });
	const activeTabData = TABS.find((tab) => tab.id === activeTab);

	return (
		<div className="bg-gray-50 flex-1 rounded-lg p-2">
			<div className="text-sm font-semibold">주문하기</div>
			<div className="flex bg-gray-200 rounded-lg mt-3">
				<OrderTabs
					tabs={TABS}
					activeTab={activeTab}
					onTabChange={setActiveTab}
				/>
			</div>
			<div className="mt-4">
				{activeTabData && <OrderTabContents activeTabData={activeTabData} />}
			</div>
		</div>
	);
}

export default OrderForm;
