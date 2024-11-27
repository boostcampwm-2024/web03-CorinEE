import { useMarketAll } from '@/hooks/market/useMarketAll';
import CoinCategories from '@/pages/home/components/CoinCategories';
import CoinList from '@/pages/home/components/CoinList';
import { MarketData } from '@/types/market';
import { MarketCategory } from '@/types/category';
import { filterCoin } from '@/utility/validation/filter';
import { isMarket } from '@/utility/validation/typeGuard';
import { useState } from 'react';
import { useMyInterest } from '@/hooks/interest/useMyInterest';

function CoinView() {
	const { data } = useMarketAll();
	const [activeCategory, setActiveCategory] = useState<MarketCategory>('KRW');
	const myInterestMarketList = useMyInterest()
	let filterData: MarketData[] = [];

	const handleCategory = (category: MarketCategory) => {
		setActiveCategory(category);
	};

	if (data) {
		if (isMarket(activeCategory)) {
			filterData = filterCoin(data, activeCategory);
		}
	}

	return (
		<div className="w-11/12 m-auto min-w-[1100px] flex flex-col justify-center">
			<div>
				<h3 className="text-2xl font-bold text-gray-800">코인 리스트</h3>
				<div className="mb-6 text-sm text-gray-700">실시간 코인 가격 확인</div>
			</div>
			<CoinCategories
				activeCategory={activeCategory}
				handleCategory={handleCategory}
			/>
			<CoinList markets={filterData} activeCategory={activeCategory} myInterestMarketList={myInterestMarketList} />
		</div>
	);
}

export default CoinView;
