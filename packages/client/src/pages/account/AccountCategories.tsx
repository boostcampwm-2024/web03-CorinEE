import { CategoryKey } from '@/types/account';

type AccountCategoriesProps = {
	text: string;
	isActive: boolean;
	category: CategoryKey;
	handleCategory: (path: CategoryKey) => void;
};

function AccountCategories({
	text,
	isActive,
	category,
	handleCategory,
}: AccountCategoriesProps) {
	return (
		<div
			className={`flex-[1] text-center font-semibold border-solid cursor-pointer
        ${
					isActive
						? 'border-b-blue-800 text-blue-800 border-b-[3px]'
						: 'border-b-gray-300 border-b-2'
				}`}
			onClick={() => handleCategory(category)}
		>
			<button>{text}</button>
		</div>
	);
}

export default AccountCategories;
