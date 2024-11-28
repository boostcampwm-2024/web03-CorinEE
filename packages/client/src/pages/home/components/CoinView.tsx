import { useMarketAll } from '@/hooks/market/useMarketAll';
import CoinCategories from '@/pages/home/components/CoinCategories';
import CoinList from '@/pages/home/components/CoinList';
import { MarketData } from '@/types/market';
import { MarketCategory } from '@/types/category';
import { filterCoin } from '@/utility/validation/filter';
import { isMarket } from '@/utility/validation/typeGuard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { TempInfo } from '@/types/tempInfo';

function CoinView() {
	const { data } = useMarketAll();
	const [activeCategory, setActiveCategory] = useState<MarketCategory>('KRW');
	let filterData: MarketData[] = [];
	const [tempInfo, setTempInfo] = useState<TempInfo>();

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.get('https://api.hangang.life/');
			setTempInfo(response.data.DATAs.DATA.HANGANG['선유']);
		};

		fetchData();
	}, []);

	const handleCategory = (category: MarketCategory) => {
		setActiveCategory(category);
	};

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
				tempInfo={tempInfo}
			/>
			<CoinList markets={filterData} activeCategory={activeCategory} />
		</div>
	);
}

export default CoinView;
