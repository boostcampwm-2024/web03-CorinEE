import { useState, Suspense } from 'react';
import { useAuthStore } from '@/store/authStore';
import { createOrderTabs } from '@/constants/orderTabs';

function OrderForm({ currentPrice }: { currentPrice: number }) {
	const [activeTab, setActiveTab] = useState('buy');
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	const TABS = createOrderTabs(currentPrice);

	return (
		<div className="bg-gray-50 flex-1 rounded-lg p-2 min-w-80">
			<div className="text-sm font-semibold">주문하기</div>
			<div className="flex bg-gray-200 rounded-lg mt-3">
				{TABS.map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={`
							flex-1 text-sm py-2 px-4 rounded-lg transition-colors
							${activeTab === tab.id ? `${tab.activeColor} bg-white` : 'text-gray-600 hover:bg-gray-100'}
						`}
					>
						{tab.value}
					</button>
				))}
			</div>
			<div className="mt-4">
				{TABS.map(
					(tab) =>
						activeTab === tab.id && (
							<div key={tab.id} className="animate-fadeIn">
								{isAuthenticated ? (
									<Suspense>{tab.component}</Suspense>
								) : (
									tab.notLogin
								)}
							</div>
						),
				)}
			</div>
		</div>
	);
}

export default OrderForm;
