import { AccountHistory } from '@/types/history';
import { formatDateTime } from '@/utility/historyUtils';
import { Link } from 'react-router-dom';

type HistoryInfoProps = AccountHistory;

function HistoryInfo({
	assetName,
	createdAt,
	price,
	quantity,
	tradeCurrency,
	tradeDate,
	tradeType,
}: HistoryInfoProps) {
	const formattedCreatedTime = formatDateTime(createdAt);
	const formattedTradeTime = formatDateTime(tradeDate);

	return (
		<div className="flex py-2 items-center text-center  border-b border-solid border-gray-300">
			<div className="flex flex-col flex-[2] ">
				<p>{formattedTradeTime.date}</p>
				<p>{formattedTradeTime.time}</p>
			</div>
			<div className="flex-[1] font-semibold">
				<Link to={`/trade/KRW-${assetName}`}>{assetName}</Link>
			</div>
			<div
				className={`flex-[1] ${tradeType === 'buy' ? 'text-red-500' : 'text-blue-500'}`}
			>
				{tradeType === 'buy' ? '매수' : '매도'}
			</div>
			<div className="flex-[3]">
				<span>{quantity.toLocaleString()}</span>
				<span className="ml-1 text-xs text-gray-600">{assetName}</span>
			</div>
			<div className="flex-[3]">
				<span>
					{price < 1
						? parseFloat(price.toFixed(5)).toString()
						: price.toLocaleString()}
				</span>
				<span className="ml-1 text-xs text-gray-600">{tradeCurrency}</span>
			</div>
			<div className="flex-[3]">
				<span>{Math.floor(quantity * price).toLocaleString()}</span>
				<span className="ml-1 text-xs text-gray-600">{tradeCurrency}</span>
			</div>
			<div className="flex flex-col flex-[2]">
				<p>{formattedCreatedTime.date}</p>
				<p>{formattedCreatedTime.time}</p>
			</div>
		</div>
	);
}

export default HistoryInfo;
