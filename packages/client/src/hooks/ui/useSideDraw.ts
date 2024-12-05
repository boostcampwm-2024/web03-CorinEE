import { useEffect, useState } from 'react';
import { SideBarCategory } from '@/types/category';
import { isSideBarMenu } from '@/utility/validation/typeGuard';

function useSideDrawer() {
	const [activeMenu, setActiveMenu] = useState<SideBarCategory>(null);
	const [isOpen, setIsOpen] = useState(false);

	const STORAGE_KEY = 'side-menu';

	const storage = {
		get: () => {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (isSideBarMenu(stored)) return stored ? stored : null;
		},
		set: (menu: SideBarCategory) => {
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

	const handleMenu = (menu: SideBarCategory) => {
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
