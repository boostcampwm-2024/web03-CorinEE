import { useEffect, useRef } from 'react';
import { CandleFormat, CandlePeriod } from '@/types/chart';
import { ISeriesApi } from 'lightweight-charts';
import { getCurrentCandleStartTime } from '@/utility/chart/chartTimeUtils';

type Props = {
	seriesRef: React.RefObject<ISeriesApi<'Candlestick'>>;
	currentPrice: number;
	activePeriod: CandlePeriod;
	refetch: () => Promise<unknown>;
	minute?: number;
};
export function useRealTimeCandle({
	seriesRef,
	currentPrice,
	activePeriod,
	refetch,
	minute,
}: Props) {
	const lastCandleRef = useRef<CandleFormat | null>(null);

	const updateRealTimeCandle = () => {
		if (!seriesRef.current || !currentPrice || !lastCandleRef.current) return;

		const currentCandleStartTime = getCurrentCandleStartTime(
			activePeriod,
			minute,
		);
		if (
			!lastCandleRef.current ||
			lastCandleRef.current.time !== currentCandleStartTime
		) {
			refetch();
		} else {
			const updatedCandle = {
				...lastCandleRef.current,
				close: currentPrice,
				high: Math.max(lastCandleRef.current.high, currentPrice),
				low: Math.min(lastCandleRef.current.low, currentPrice),
			};
			lastCandleRef.current = updatedCandle;
			seriesRef.current.update(updatedCandle);
		}
	};

	useEffect(() => {
		if (!seriesRef.current || !currentPrice) return;
		updateRealTimeCandle();
	}, [currentPrice, minute, activePeriod]);

	return { lastCandleRef };
}
