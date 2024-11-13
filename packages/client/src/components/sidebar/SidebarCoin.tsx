import colorClasses from '@/constants/priceColor';
import { Change, SSEDataType } from '@/types/ticker';
import { Formatters } from '@/utility/formatData';
import { Link } from 'react-router-dom';

type SidebarCoinProps = {
	image_url: string;
	korean_name: string;
	listNumber: number;
	formatters: Formatters;
	sseData: SSEDataType;
	market: string;
};

function SidebarCoin({
	listNumber,
	image_url,
	korean_name,
	formatters,
	sseData,
	market,
}: SidebarCoinProps) {
	const change: Change = sseData[market]?.change;

	const trade_price = formatters.formatTradePrice(sseData[market]?.trade_price);
	const change_rate = formatters.formatChangeRate(
		sseData[market]?.signed_change_rate,
		change,
	);
	const change_price = formatters.formatSignedChangePrice(
		sseData[market]?.signed_change_price,
		change,
	);
	return (
		<Link to={`/trade/${market}`}> 
			<div className="flex items-center py-2 px-1 gap-2 hover:bg-gray-200 border rounded-lg cursor-pointer">
				<span className="text-base font-medium text-blue-700">
					{listNumber}
				</span>
				<img className="w-8 -h-8" src={image_url}></img>
				<span className="text-sm flex-[1] text-gray-800 font-semibold">
					{korean_name}
				</span>
				<div className="flex flex-col items-end">
					<span className="text-base font-semibold">{`${trade_price}`}</span>
					<span className={`text-xs font-medium ${colorClasses[change]}`}>
						{change_price} {change_rate}
					</span>
				</div>
			</div>
		</Link>
	);
}

export default SidebarCoin;
