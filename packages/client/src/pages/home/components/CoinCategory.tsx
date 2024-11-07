import { MarketCategory } from '@/types/menu';

type CoinCategoryProps = {
	id: MarketCategory;
	category: string;
	activeCategory: MarketCategory;
	handleCategory: (category: MarketCategory) => void;
};

function CoinCategory({
	id,
	category,
	activeCategory,
	handleCategory,
}: CoinCategoryProps) {
	const isActive = id === activeCategory;

	return (
		<li>
			<button
				className={`text-gray-800 px-3 ${isActive ? 'bg-gray-300' : 'bg-gray-100'} rounded-md hover:bg-gray-300`}
				onClick={() => handleCategory(id)}
			>
				{category}
			</button>
		</li>
	);
}

export default CoinCategory;
