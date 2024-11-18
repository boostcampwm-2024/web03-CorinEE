import AccountCategories from '@/pages/account/AccountCategory';
import { AccountCategory } from '@/types/category';
import { useState } from 'react';

function Account() {
	const [currentAccountCategory, setCurrentAccountCategory] =
		useState<AccountCategory>('BALANCE');

	const categoryInfo = {
		BALANCE: { text: '보유자산' },
		HISTORY: { text: '거래내역' },
		WAIT_ORDERS: { text: '미체결' },
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
		
		</>
	);
}

export default Account;
