import SideDrawer from '@/components/SideDrawer';
import { useState } from 'react';
function Sidebar() {
	const [openRight, setOpenRight] = useState(false);
	const openDrawerRight = () => setOpenRight(!openRight);
	const closeDrawerRight = () => setOpenRight(false);

	return (
		<div className="flex bg-gray-100">
			<SideDrawer openRight={openRight} closeDrawerRight={closeDrawerRight} />
			<div className="w-24 h-screen border-red-100 border">
				<div>
					<button
						onClick={openDrawerRight}
						className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					>
						Open Drawer Right
					</button>
				</div>
			</div>
		</div>
	);
}

export default Sidebar;
