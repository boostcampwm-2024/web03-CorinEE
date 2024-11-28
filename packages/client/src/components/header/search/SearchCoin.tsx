import { MarketData } from '@/types/market';
import { useNavigate } from 'react-router-dom';

type SearchCoinProps = {
	handleOpen: () => void;
	market: MarketData;
};

function SearchCoin({ handleOpen, market }: SearchCoinProps) {
	const navigate = useNavigate();
	const handleClick = (market: string) => {
		handleOpen();
		navigate(`/trade/${market}`);
	};

	return (
		<div
			key={market.market}
			className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-50"
			onClick={() => handleClick(market.market)}
		>
			<img className="w-7 h-7" src={market.image_url}></img>
			<div className="text-black font-semibold text-sm">
				{market.korean_name}
			</div>
		</div>
	);
}

export default SearchCoin;
