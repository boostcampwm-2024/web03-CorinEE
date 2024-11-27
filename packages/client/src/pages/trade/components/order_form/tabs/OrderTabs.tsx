import { OrderTabItem } from '@/constants/orderTabs';
import { Dispatch, SetStateAction } from 'react';

type OrderTabsProsp = {
	tabs: OrderTabItem[];
	activeTab: 'buy' | 'sell' | 'wait';
	onTabChange: Dispatch<SetStateAction<'buy' | 'sell' | 'wait'>>;
};

function OrderTabs({ tabs, activeTab, onTabChange }: OrderTabsProsp) {
	return tabs.map((tab) => (
		<button
			key={tab.id}
			onClick={() => onTabChange(tab.id)}
			className={`
                flex-1 text-sm py-2 px-4 rounded-lg transition-colors
                ${activeTab === tab.id ? `${tab.activeColor} bg-white` : 'text-gray-600 hover:bg-gray-100'}
              `}
		>
			{tab.value}
		</button>
	));
}

export default OrderTabs;
