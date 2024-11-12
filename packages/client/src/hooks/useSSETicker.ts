import { SSEDataType } from '@/types/ticker';
import { useEffect, useRef, useState } from 'react';
export function useSSETicker(targetMarketCodes: { market: string }[]) {
	const BASE_URL = 'http://175.106.98.147:3000/upbit/price-updates';
	const eventSource = useRef<EventSource | null>(null);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [sseData, setSSEData] = useState<SSEDataType | null>();

	useEffect(() => {
		const queryString = targetMarketCodes
			.map((code) => `coins=${encodeURIComponent(code.market)}`)
			.join('&');
		const url = `${BASE_URL}?${queryString}`;

		if (!eventSource.current) {
			eventSource.current = new EventSource(url);

			const sseOpenHandler = () => {
				setIsConnected(true);
			};

			const sseErrorHandler = (error: Event) => {
				console.error('SSE Error:', error);
				setIsConnected(false);
				if (eventSource.current) {
					eventSource.current.close();
					eventSource.current = null;
				}
			};

			const handlePriceUpdate = (event: MessageEvent) => {
				try {
					const parsedData = JSON.parse(event.data);
					setSSEData((prev) => ({
						...prev,
						[parsedData.code]: parsedData,
					}));
				} catch (error) {
					console.error('Failed to parse SSE message:', error);
				}
			};

			eventSource.current.onopen = sseOpenHandler;
			eventSource.current.onerror = sseErrorHandler;
			eventSource.current.addEventListener('price-update', handlePriceUpdate);

			return () => {
				if (eventSource.current) {
					eventSource.current.removeEventListener(
						'price-update',
						handlePriceUpdate,
					);
					eventSource.current.close();
					eventSource.current = null;
					setIsConnected(false);
					setSSEData(null);
				}
			};
		}
	}, [targetMarketCodes]);
	return {
		eventSource: eventSource.current,
		isConnected,
		sseData,
	};
}
