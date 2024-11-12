import Interest from '@/components/sidebar/Interest';
import MyInvestment from '@/components/sidebar/MyInvestment';
import Realtime from '@/components/sidebar/Realtime';
import RecentlyViewed from '@/components/sidebar/RecentlyViewed';
import { SideBarMenu } from '@/types/menu';

type SideDrawerProps = {
	isOpen: boolean;
	activeMenu: SideBarMenu;
};

function SideDrawer({ isOpen, activeMenu }: SideDrawerProps) {

	const activeMenuComponent = {
		MY_INVESTMENT: <MyInvestment />,
		INTEREST: <Interest />,
		RECENTLY_VIEWED: <RecentlyViewed />,
		REALTIME: <Realtime />,
	};
	
	return (
		<div className="overflow-hidden ">
			<div
				className={`
            h-full
            bg-gray-100
            transition-all duration-300 ease-in-out
			border-l border-gray-400 border-solid
            ${isOpen ? 'translate-x-0 w-64' : 'translate-x-full w-0'}
          `}
			>
				{activeMenu && activeMenuComponent[activeMenu]}
			</div>
		</div>
	);
}

export default SideDrawer;
