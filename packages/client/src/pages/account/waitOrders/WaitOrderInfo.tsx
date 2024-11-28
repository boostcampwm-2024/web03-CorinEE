import { useDeleteWaitOrder } from '@/hooks/trade/useDeleteWaitOrder';
import { AccountWaitOrder } from '@/types/waitOrder';
import { formatDateTime } from '@/utility/historyUtils';
import { Link } from 'react-router-dom';

type WaitOrderInfoProps = Omit<
	AccountWaitOrder,
	'img_url' | 'koreanName' | 'userId'
>;

function WaitOrderInfo({
	coin,
	createdAt,
	market,
	price,
	quantity,
	tradeType,
	tradeId,
}: WaitOrderInfoProps) {
	const formattedCreatedTime = formatDateTime(createdAt);
	const { deleteOrder } = useDeleteWaitOrder();
	const handleDelete = async () => {
		deleteOrder.mutateAsync({ tradeId, tradeType });
	};

	return (
		<>
			<div className="flex py-2 items-center text-center  border-b border-solid border-gray-300">
				<div className="w-[20%] flex flex-col">
					<p>{formattedCreatedTime.date}</p>
					<p>{formattedCreatedTime.time}</p>
				</div>
				<div className="w-[10%] font-semibold">
					<Link to={`/trade/KRW-${coin}`}>{`${coin}/${market}`}</Link>
				</div>
				<div
					className={`w-[10%] ${tradeType === 'buy' ? 'text-red-500' : 'text-blue-500'}`}
				>
					{tradeType === 'buy' ? '매수' : '매도'}
				</div>
				<div className="w-[10%]">
					<span>{price.toLocaleString()}</span>
					<span className="ml-1 text-xs text-gray-600">KRW</span>
				</div>
				<div className="w-[20%]">
					<span>{quantity.toLocaleString()}</span>
					<span className="ml-1 text-xs text-gray-600">{coin}</span>
				</div>
				<div className="w-[20%]">
					<span>{quantity.toLocaleString()}</span>
					<span className="ml-1 text-xs text-gray-600">{coin}</span>
				</div>
				<div className="w-[10%]">
					<button
						className="border border-solid border-gray-400 p-1 font-semibold"
						onClick={handleDelete}
					>
						주문취소
					</button>
				</div>
			</div>
		</>
	);
}

export default WaitOrderInfo;
