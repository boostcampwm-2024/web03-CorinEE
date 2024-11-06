import { SideBarMenu } from '@/types/menu';
export function isSideBarMenu(value: string | null): value is SideBarMenu {
	return (
		value === '실시간' ||
		value === '관심' ||
		value === '내 투자' ||
		value === '최근 본' ||
		value === null
	);
}
