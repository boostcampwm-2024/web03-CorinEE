import AccountCategories from '@/pages/account/AccountCategory';
import Balance from '@/pages/account/Balance';
import History from '@/pages/account/History';
import WaitOrders from '@/pages/account/WaitOrders';
import { AccountCategory } from '@/types/category';
import { useState } from 'react';

function Account() {
	const [currentAccountCategory, setCurrentAccountCategory] =
		useState<AccountCategory>('BALANCE');

	const categoryInfo = {
		BALANCE: { text: '보유자산', component: <Balance /> },
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

export default Account;
