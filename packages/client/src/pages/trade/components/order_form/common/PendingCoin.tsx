import { AccountWaitOrder } from '@/types/waitOrder';

interface PendingCoinProps {
	order: AccountWaitOrder;
	onCancel: (tradeId: number, tradeType: string) => void;
}

export function PendingCoin({ order, onCancel }: PendingCoinProps) {
	const tradeTypeConfig = {
		sell: { text: '매도', className: 'text-blue-800' },
		buy: { text: '매수', className: 'text-red-600' },
	};
	const { text, className } = tradeTypeConfig[order.tradeType];

	return (
		<div className="flex justify-between items-center border-b border-solid border-gray-300 py-2">
			<div>
				<div className="flex gap-1">
					<div className={`${className} font-semibold`}>{text}</div>
					<div>{order.quantity}개</div>
				</div>
				<div className="text-sm text-gray-700">
					코인 당 {order.price.toLocaleString()}원
				</div>
			</div>
			<button
				className="font-semibold px-2 py-1 text-blue-900 rounded-md text-sm bg-blue-100 hover:bg-blue-200"
				onClick={() => onCancel(order.tradeId, order.tradeType)}
			>
				취소
			</button>
		</div>
	);
}
