import { lazy, Suspense } from 'react';
import { SideBarCategory } from '@/types/category';

const MyInvestment = lazy(() => import('@/components/sidebar/MyInvestment'));
const Interest = lazy(() => import('@/components/sidebar/MyInterest'));
const RecentlyViewed = lazy(
	() => import('@/components/sidebar/RecentlyViewed'),
);
const Realtime = lazy(() => import('@/components/sidebar/Realtime'));

type SideDrawerProps = {
	isOpen: boolean;
	activeMenu: SideBarCategory;
};

function SideDrawer({ isOpen, activeMenu }: SideDrawerProps) {
	const activeMenuComponent = {
		MY_INVESTMENT: <MyInvestment />,
		INTEREST: <Interest />,
		RECENTLY_VIEWED: <RecentlyViewed />,
		REALTIME: <Realtime />,
	};

	return (
		<div className="overflow-hidden bg-gray-100">
			<div
				className={`
          h-full
          bg-gray-100
          transition-all duration-300 ease-in-out
          border-l border-gray-400 border-solid
          ${isOpen ? 'translate-x-0 w-80' : 'translate-x-full w-0'}
        `}
			>
				<Suspense>{activeMenu && activeMenuComponent[activeMenu]}</Suspense>
			</div>
		</div>
	);
}

export default SideDrawer;
