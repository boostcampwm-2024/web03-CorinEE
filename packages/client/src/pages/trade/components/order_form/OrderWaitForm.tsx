import { useMarketParams } from '@/hooks/market/useMarketParams';
import { usePendingCoin } from '@/hooks/usePendingCoin';
import NoCoin from '@/pages/trade/components/order_form/common/NoCoin';

function OrderWaitForm() {
	const { market } = useMarketParams();
	const { data } = usePendingCoin(`${market}`);

	if (!data.tradeData.length)
		return <NoCoin message="대기중인 주문이 없어요" />;
	return <div>order wait</div>;
}

export default OrderWaitForm;
