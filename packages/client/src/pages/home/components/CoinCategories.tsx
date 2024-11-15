import CoinCategory from '@/pages/home/components/CoinCategory';
import { MarketCategory } from '@/types/category';

type CoinCategoriesProps = {
	activeCategory: MarketCategory;
	handleCategory: (category: MarketCategory) => void;
};

export function CoinCategories({
	activeCategory,
	handleCategory,
}: CoinCategoriesProps) {
	const CATEGORIES: { id: MarketCategory; value: string }[] = [
		{ id: 'KRW', value: '원화' },
		{ id: 'BTC', value: 'BTC' },
		{ id: 'USDT', value: 'USDT' },
		{ id: 'OWN', value: '보유' },
		{ id: 'INTEREST', value: '내 관심' },
	];

	return (
		<ul className="flex gap-8 text-lg">
			{CATEGORIES.map((category) => (
				<CoinCategory
					key={category.id}
					id={category.id}
					category={category.value}
					activeCategory={activeCategory}
					handleCategory={handleCategory}
				/>
			))}
		</ul>
	);
}

export default CoinCategories;
