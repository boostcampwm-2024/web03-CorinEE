import { SideBarCategory } from '@/types/category';
import React from 'react';

type SidBarButtonProps = {
	icons: JSX.Element;
	text: string;
	active: SideBarCategory;
	handleMenu: (menu: SideBarCategory) => void;
};

function SideBarButton({ icons, text, handleMenu, active }: SidBarButtonProps) {
	const activeMenu = localStorage.getItem('side-menu');
	const isActive = activeMenu === active;
	return (
		<div
			className="group flex flex-col items-center gap-2 py-2 cursor-pointer"
			onClick={() => handleMenu(active)}
		>
			<button className="text-white rounded p-1 group-hover:bg-gray-300">
				{React.cloneElement(icons, {
					className: `w-6 h-6 ${
						isActive
							? 'fill-black'
							: 'fill-blue-gray-200 group-hover:fill-black'
					}`,
				})}
			</button>
			<div
				className={`
          text-xs 
          ${isActive ? 'text-black' : 'text-gray-600 group-hover:text-black'}
        `}
			>
				{text}
			</div>
		</div>
	);
}

export default SideBarButton;
