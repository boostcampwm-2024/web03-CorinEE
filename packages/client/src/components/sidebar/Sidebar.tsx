import SideDrawer from '@/components/sidebar/SideDrawer';
import Calendar from '@asset/calendar.svg?react';
import Heart from '@asset/heart.svg?react';
import Invest from '@asset/invest.svg?react';
import Fire from '@asset/fire.svg?react';
import SideBarButton from '@/components/sidebar/SidebarButton';
import useSideDraw from '@/hooks/useSideDraw';
import { SideBarMenu } from '@/types/menu';

function Sidebar() {
	const { isOpen, handleMenu } = useSideDraw();

	type SideBarButtons = {
		id: string;
		icons: JSX.Element;
		text: SideBarMenu;
	};

	const SIDEBAR_BUTTONS: SideBarButtons[] = [
		{
			id: 'invest',
			icons: <Invest />,
			text: '내 투자',
		},
		{
			id: 'heart',
			icons: <Heart />,
			text: '관심',
		},
		{
			id: 'calendar',
			icons: <Calendar />,
			text: '최근 본',
		},
		{
			id: 'fire',
			icons: <Fire />,
			text: '실시간',
		},
	];

	return (
		<div className="flex bg-gray-100 h-screen ">
			<SideDrawer isOpen={isOpen} />
			<div className="w-20 flex flex-col gap-3 items-center border-l border-gray-400 border-solid">
				{SIDEBAR_BUTTONS.map((button) => (
					<SideBarButton
						key={button.id}
						icons={button.icons}
						text={button.text}
						handleMenu={handleMenu}
					/>
				))}
			</div>
		</div>
	);
}

export default Sidebar;
