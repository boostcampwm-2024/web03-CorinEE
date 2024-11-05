import SideDrawer from '@/components/SideDrawer';
import { useState } from 'react';
import Calendar from '@asset/calendar.svg?react';
import Heart from '@asset/heart.svg?react';
import Invest from '@asset/invest.svg?react';
import Fire from '@asset/fire.svg?react';
function Sidebar() {
	const [openRight, setOpenRight] = useState(false);
	const openDrawerRight = () => setOpenRight(!openRight);
	const closeDrawerRight = () => setOpenRight(false);

	return (
		<div className="flex bg-gray-100 h-screen ">
			<SideDrawer openRight={openRight} closeDrawerRight={closeDrawerRight} />
			<div className="w-20 flex flex-col gap-3 items-center border-l border-gray-400 border-solid">
				<div className="flex flex-col items-center gap-2 py-2">
					<button onClick={openDrawerRight} className="  text-white rounded ">
						<Invest className="w-6 h-6" />
					</button>
					<div className="text-xs text-gray-600">내 투자</div>
				</div>
				<div>
					<div className="flex flex-col items-center gap-2 py-2">
						<button onClick={openDrawerRight} className="  text-white rounded ">
							<Heart className="w-6 h-6" />
						</button>
						<div className="text-xs text-gray-600">관심</div>
					</div>
				</div>
				<div>
					<div className="flex flex-col items-center gap-2 py-2">
						<button onClick={openDrawerRight} className="  text-white rounded ">
							<Calendar className="w-6 h-6" />
						</button>
						<div className="text-xs text-gray-600">최근 본</div>
					</div>
				</div>
				<div>
					<div className="flex flex-col items-center gap-2 py-2">
						<button onClick={openDrawerRight} className="  text-white rounded ">
							<Fire className="w-6 h-6" />
						</button>
						<div className="text-xs text-gray-600">실시간</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Sidebar;
