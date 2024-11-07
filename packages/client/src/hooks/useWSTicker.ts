import { MarketData } from '@/types/market';
import { CoinTicker } from '@/types/ticker';
import { useEffect, useRef, useState } from 'react';

export function useWSTicker(targetMarketCodes: MarketData[]) {
	const SOCKET_URL = 'wss://api.upbit.com/websocket/v1';
	const socket = useRef<WebSocket | null>(null);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [socketData, setSocketData] = useState<CoinTicker[] | null>();

	useEffect(() => {
		if (!socket.current) {
			socket.current = new WebSocket(SOCKET_URL);

			const socketOpenHandler = () => {
				setIsConnected(true);
				if (socket.current?.readyState === 1) {
					const sendContent = [
						{ ticket: 'test' },
						{
							type: 'ticker',
							codes: targetMarketCodes.map((code) => code.market),
						},
					];
					socket.current.send(JSON.stringify(sendContent));
				}
			};

			const socketCloseHandler = () => {
				setIsConnected(false);
				setSocketData(null);
			};

			const socketMessageHandler = async (event) => {
				try {
					const buffer = await event.data.arrayBuffer();
					const decoder = new TextDecoder();
					const message = decoder.decode(buffer);
					const parsedData = JSON.parse(message);

					setSocketData((prev) => ({
						...prev,
						[parsedData.code]: parsedData,
					}));
				} catch (error) {
					console.error(error);
				}
			};

			socket.current.onopen = socketOpenHandler;
			socket.current.onclose = socketCloseHandler;
			socket.current.onmessage = socketMessageHandler;

			return () => {
				if (socket.current) {
					if (socket.current.readyState != 0) {
						socket.current.close();
						socket.current = null;
					}
				}
			};
		}
	}, [targetMarketCodes]);

	return { socket: socket.current, isConnected, socketData };
}
