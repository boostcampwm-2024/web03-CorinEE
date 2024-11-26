import AccountCategories from '@/pages/account/AccountCategories';
import History from '@/pages/account/history/History';
import WaitOrders from '@/pages/account/waitOrders/WaitOrders';
import Balance from '@/pages/account/balance/Balance';
import { AccountCategory } from '@/types/category';
import { useState } from 'react';

function AccountContent() {
	const [currentAccountCategory, setCurrentAccountCategory] =
		useState<AccountCategory>('BALANCE');

	const categoryInfo = {
		BALANCE: {
			text: '보유자산',
			component: <Balance />,
		},
		HISTORY: { text: '거래내역', component: <History /> },
		WAIT_ORDERS: { text: '미체결', component: <WaitOrders /> },
	};

	const handleCategory = (accountCategory: AccountCategory) => {
		setCurrentAccountCategory(accountCategory);
	};

	return (
		<>
			<div className="flex rounded-md">
				{Object.entries(categoryInfo).map(([category, info]) => (
					<AccountCategories
						key={category}
						text={info.text}
						isActive={currentAccountCategory === category}
						category={category as AccountCategory}
						handleCategory={handleCategory}
					/>
				))}
			</div>

			{categoryInfo[currentAccountCategory].component}
		</>
	);
}

export default AccountContent;
