import { ACCOUNT_CATEGORY_INFO } from '@/constants/accountCategory';
import AccountCategories from '@/pages/account/AccountCategories';
import { CategoryKey } from '@/types/account';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

function AccountContent() {
	const navigate = useNavigate();
	const location = useLocation();

	const getCurrentCategory = () => {
		const path = location.pathname.split('/').pop() || 'balance';
		return path;
	};

	const handleCategory = (path: CategoryKey) => {
		navigate(ACCOUNT_CATEGORY_INFO[path].path);
	};

	return (
		<>
			<div className="flex rounded-md">
        {Object.keys(ACCOUNT_CATEGORY_INFO).map((category) => (
          <AccountCategories
            key={category}
            text={ACCOUNT_CATEGORY_INFO[category as CategoryKey].text}
            isActive={getCurrentCategory() === category}
            category={category as CategoryKey}
            handleCategory={handleCategory}
          />
				))}
			</div>
			<Outlet />
		</>
	);
}

export default AccountContent;
