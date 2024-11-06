import { useEffect, useState } from 'react';
import { SideBarMenu } from '@/types/menu';
import { isSideBarMenu } from '@/utility/typeGuard';

function useSideDrawer() {
	const [activeMenu, setActiveMenu] = useState<SideBarMenu>(null);
	const [isOpen, setIsOpen] = useState(false);

	const STORAGE_KEY = 'side-menu';

	const storage = {
		get: () => {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (isSideBarMenu(stored)) return stored ? stored : null;
		},
		set: (menu: SideBarMenu) => {
			if (menu) {
				localStorage.setItem(STORAGE_KEY, menu);
			} else {
				localStorage.removeItem(STORAGE_KEY);
			}
		},
	};

	useEffect(() => {
		const savedMenu = storage.get();
		if (savedMenu) {
			setActiveMenu(savedMenu);
			setIsOpen(true);
		}
	}, []);

	const handleMenu = (menu: SideBarMenu) => {
		if (activeMenu === menu) {
			setActiveMenu(null);
			setIsOpen(false);
			storage.set(null);
			return;
		}

		setActiveMenu(menu);
		setIsOpen(true);
		storage.set(menu);
	};

	return {
		activeMenu,
		isOpen,
		handleMenu,
	};
}

export default useSideDrawer;
