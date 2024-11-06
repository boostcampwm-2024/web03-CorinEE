import CoinCategory from "@/pages/home/components/CoinCategory";

export function CoinCategories({ activeCategory, handleCategory }) {
	const CATEGORIES = ['원화', 'BTC', 'USDT', '보유', '내 관심'];

	return (
		<ul className="flex gap-8 text-lg">
			{CATEGORIES.map((category, index) => (
				<CoinCategory
					key={index}
					category={category}
					activeCategory={activeCategory}
					handleCategory={handleCategory}
				/>
			))}
		</ul>
	);
}

export default CoinCategories;
