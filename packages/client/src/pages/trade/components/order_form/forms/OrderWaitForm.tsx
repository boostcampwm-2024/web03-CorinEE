import { useMarketParams } from '@/hooks/market/useMarketParams';
import { useDeleteWaitOrder } from '@/hooks/trade/useDeleteWaitOrder';
import { useMyWaitOrders } from '@/hooks/account/useMyWaitOrders';
import NoCoin from '@/pages/trade/components/order_form/common/NoCoin';
import { PendingCoin } from '@/pages/trade/components/order_form/common/PendingCoin';

function OrderWaitForm() {
	const { market } = useMarketParams();
	const data = useMyWaitOrders(market);
	const { deleteOrder } = useDeleteWaitOrder();

	const handleCancel = (tradeId: number, tradeType: string) => {
		deleteOrder.mutateAsync({ tradeId, tradeType });
	};

	if (!data.length) {
		return <NoCoin message="대기중인 주문이 없어요" />;
	}

	return (
		<div className="space-y-2">
			{data.map((order, index) => (
				<PendingCoin key={index} order={order} onCancel={handleCancel} />
			))}
		</div>
	);
}

export default OrderWaitForm;
