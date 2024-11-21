import { SSEDataType } from '@/types/ticker';
import { useEffect, useRef, useState } from 'react';

export function useSSETicker(targetMarketCodes: { market: string }[]) {
	const BASE_URL = `${!import.meta.env.VITE_API_BASE_URL ? '' : import.meta.env.VITE_API_BASE_URL}/api/upbit/price-updates`;
	const eventSource = useRef<EventSource | null>(null);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [sseData, setSSEData] = useState<SSEDataType | null>();
	const isReconnecting = useRef(false); // 재연결 중인지 확인

	const connectToSSE = () => {
		if (!targetMarketCodes?.length || isReconnecting.current) return;

		const queryString = targetMarketCodes
			.map((code) => `coins=${encodeURIComponent(code.market)}`)
			.join('&');
		const url = `${BASE_URL}?${queryString}`;

		if (eventSource.current) {
			eventSource.current.close();
			eventSource.current = null;
		}

		eventSource.current = new EventSource(url);

		const sseOpenHandler = () => {
			setIsConnected(true);
			isReconnecting.current = false; // 연결 성공 시 플래그 해제
		};

		const sseErrorHandler = (error: Event) => {
			console.error('SSE Error:', error);
			setIsConnected(false);

			// 연결이 끊어졌을 때 바로 재연결 시도
			if (!isReconnecting.current) {
				isReconnecting.current = true;
				connectToSSE();
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
	};

	useEffect(() => {
		connectToSSE();

		return () => {
			if (eventSource.current) {
				eventSource.current.close();
				eventSource.current = null;
			}
			setIsConnected(false);
			setSSEData(null);
		};
	}, [targetMarketCodes]);

	return {
		eventSource: eventSource.current,
		isConnected,
		sseData,
	};
}
