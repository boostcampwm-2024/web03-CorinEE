import CoinCategories from '@/pages/home/components/CoinCategories';
import { useState } from 'react';

function CoinView() {
	const [activeCategory, setActiveCategory] = useState('원화');

	const handleCategory = (category) => {
		setActiveCategory(category);
	};

	return (
		<div>
			<h3 className="text-2xl font-bold text-gray-800">코인 리스트</h3>
			<div className="text-sm text-gray-700">실시간 코인 가격 확인</div>
			{/* <CoinCategories activeCategory={activeCategory} handleCategory={handleCategory} /> */}
		</div>
	);
}

export default CoinView;
