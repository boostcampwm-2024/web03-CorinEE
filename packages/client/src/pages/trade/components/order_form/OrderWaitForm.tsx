import { useMarketParams } from '@/hooks/market/useMarketParams';
import { usePendingCoin } from '@/hooks/usePendingCoin';
import { useToast } from '@/hooks/useToast';
import NoCoin from '@/pages/trade/components/order_form/common/NoCoin';
import { PendingCoin } from '@/pages/trade/components/order_form/common/PendingCoin';

function OrderWaitForm() {
	const { market } = useMarketParams();
	const { data } = usePendingCoin(market);
	const toast = useToast();

	const handleCancel = () => {
		toast.info('개발중인 기능입니다!');
	};

	if (!data.result.length) {
		return <NoCoin message="대기중인 주문이 없어요" />;
	}

	return (
		<div className="space-y-2">
			{data.result.map((order, index) => (
				<PendingCoin key={index} order={order} onCancel={handleCancel} />
			))}
		</div>
	);
}

export default OrderWaitForm;
