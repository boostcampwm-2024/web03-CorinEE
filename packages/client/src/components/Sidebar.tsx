import { useState } from 'react';
import { Button } from '@material-tailwind/react';
import SideDrawer from '@/components/SideDrawer';
function Sidebar() {
	const [openRight, setOpenRight] = useState(false);
	const openDrawerRight = () => setOpenRight(!openRight);
	const closeDrawerRight = () => setOpenRight(false);
	return (
		<div>
			<div
				className={`w-32 h-screen border-red-100 border transition-transform duration-300 ease-in-out transform ${
					openRight ? '-translate-x-[300px]' : 'translate-x-0'
				}`}
			>
				<div>
					<Button onClick={openDrawerRight}>Open Drawer Right</Button>
				</div>
			</div>
			<SideDrawer
				openRight={openRight}
				closeDrawerRight={closeDrawerRight}
			></SideDrawer>
		</div>
	);
}

export default Sidebar;
