import CoinCategory from '@/pages/home/components/CoinCategory';
import { MarketCategory } from '@/types/category';
import { TempInfo } from '@/types/tempInfo';

type CoinCategoriesProps = {
	activeCategory: MarketCategory;
	handleCategory: (category: MarketCategory) => void;
	tempInfo: TempInfo | undefined;
};

export function CoinCategories({
	activeCategory,
	handleCategory,
	tempInfo,
}: CoinCategoriesProps) {
	const CATEGORIES: { id: MarketCategory; value: string }[] = [
		{ id: 'KRW', value: '원화' },
		{ id: 'BTC', value: 'BTC' },
		{ id: 'USDT', value: 'USDT' },
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
			{tempInfo && (
				<div className="flex-[1] text-end">
					<span className="text-sm text-gray-700">
						{tempInfo.LAST_UPDATE.split(' ')[0]} 기준 한강물 온도
					</span>
					<span className="font-semibold text-xl text-blue-900">
						{' '}
						{tempInfo.TEMP}°C
					</span>
				</div>
			)}
		</ul>
	);
}

export default CoinCategories;
