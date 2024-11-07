import { useMarketAll } from '@/hooks/useMarketAll';
import CoinCategories from '@/pages/home/components/CoinCategories';
import { MarketData } from '@/types/market';
import { MarketCategory } from '@/types/menu';
import { filterCoin } from '@/utility/marketDataUtil';
import { isMarket } from '@/utility/typeGuard';
import { useState } from 'react';

function CoinView() {
	const { data, isPending, error } = useMarketAll();
	const [activeCategory, setActiveCategory] = useState<MarketCategory>('KRW');
	let filterData: MarketData[] = [];

	const handleCategory = (category: MarketCategory) => {
		setActiveCategory(category);
	};

	if (isPending) return;

	if (data) {
		if (isMarket(activeCategory)) {
			filterData = filterCoin(data, activeCategory);
		}
	}

	return (
		<div>
			<h3 className="text-2xl font-bold text-gray-800">코인 리스트</h3>
			<div className="mb-6 text-sm text-gray-700">실시간 코인 가격 확인</div>
			<CoinCategories
				activeCategory={activeCategory}
				handleCategory={handleCategory}
			/>
		</div>
	);
}

export default CoinView;
