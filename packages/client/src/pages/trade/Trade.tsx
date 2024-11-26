import Chart from '@/pages/trade/components/chart/Chart';
import OrderBook from '@/pages/trade/components/order_book/OrderBook';
import OrderForm from '@/pages/trade/components/order_form/OrderForm';
import TradeHeader from '@/pages/trade/components/trade_header/TradeHeader';
import ChartSkeleton from '@/pages/trade/components/chart/ChartSkeleton';
import TradeFooter from '@/pages/trade/components/trade_footer/TradeFooter';
import { useNavigate, useParams } from 'react-router-dom';
import { useSSETicker } from '@/hooks/SSE/useSSETicker';
import { Suspense, useMemo, useState, useCallback } from 'react';
import { useToast } from '@/hooks/ui/useToast';
import { useEffect } from 'react';
import { useValidCoin } from '@/hooks/market/useValidCoin';

function Trade() {
	const { market } = useParams();
	const toast = useToast();
	const navigate = useNavigate();

	const marketCode = useMemo(() => (market ? [{ market }] : []), [market]);
	const { sseData: price } = useSSETicker(marketCode);
	const [selectPrice, setSelectPrice] = useState<number | null>(null);
	const { isValidCoin } = useValidCoin(market);

	useEffect(() => {
		if (!isValidCoin) {
			toast.error('원화로 거래 불가능한 코인이에요');
			navigate('/');
		}
	}, [isValidCoin]);

	const handleSelectPrice = useCallback((price: number) => {
		setSelectPrice(price);
	}, []);

	if (!market || !price) return null;
	const currentPrice = price[market]?.trade_price;

	return (
		<>
			<div className="w-full h-full flex flex-col">
				<TradeHeader market={market} sseData={price} />
				<div className="flex flex-1 gap-2 max-h-[670px] min-h-0">
					<Suspense fallback={<ChartSkeleton />}>
						<Chart market={market} currentPrice={currentPrice} />
					</Suspense>
					<OrderBook
						currentPrice={currentPrice}
						marketCode={marketCode}
						handleSelectPrice={handleSelectPrice}
					/>
					<OrderForm currentPrice={currentPrice} selectPrice={selectPrice} />
				</div>
			</div>
			<Suspense>
				<TradeFooter />
			</Suspense>
		</>
	);
}

export default Trade;
