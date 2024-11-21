import { SSEOrderBook } from '@/types/orderbook';
import { useRef, useState, useEffect } from 'react';

export function useSSEOrderbook(targetMarketCodes: { market: string }[]) {
	const BASE_URL = `${!import.meta.env.VITE_API_BASE_URL ? '' : import.meta.env.VITE_API_BASE_URL}/api/upbit/orderbook`;
	const eventSource = useRef<EventSource | null>(null);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [sseData, setSSEData] = useState<SSEOrderBook | null>();

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

			const handleOrderbookUpdate = (event: MessageEvent) => {
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
			eventSource.current.addEventListener(
				'orderbook-update',
				handleOrderbookUpdate,
			);

			return () => {
				if (eventSource.current) {
					eventSource.current.removeEventListener(
						'price-update',
						handleOrderbookUpdate,
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
