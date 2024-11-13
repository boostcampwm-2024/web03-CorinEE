import colorClasses from '@/constants/priceColor';
import { Change } from '@/types/ticker';

type CoinInfoProps = {
	korean_name: string;
	code: string;
	change: Change;
	trade_price: string;
	change_price: string;
	change_rate: string;
	image_url: string;
};

function CoinInfo({
	korean_name,
	code,
	change,
	trade_price,
	change_price,
	change_rate,
	image_url,
}: CoinInfoProps) {
	return (
		<div className="flex gap-2">
			<img className="w-10 h-10" src={image_url} />
			<div>
				<div>
					<span className="pr-1">{korean_name}</span>
					<span className="text-gray-500 text-sm">{code}</span>
				</div>
				<span className={`text-lg ${colorClasses[change]}`}>
					{trade_price} 원
				</span>
				<span className="text-gray-700 text-sm"> 전일대비</span>
				<span className={`text-sm ${colorClasses[change]} pl-2`}>
					{change_price}({change_rate})
				</span>
			</div>
		</div>
	);
}

export default CoinInfo;
