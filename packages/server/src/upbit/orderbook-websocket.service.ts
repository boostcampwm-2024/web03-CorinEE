import { Injectable, OnModuleInit } from '@nestjs/common';
import * as WebSocket from 'ws';
import { SseService } from './sse.service';
import { CoinListService } from './coin-list.service';
import { UPBIT_WEBSOCKET_CONNECTION_TIME, UPBIT_WEBSOCKET_URL, UPBIT_UPDATED_COIN_INFO_TIME, UPBIT_UPDATED_ORDER_INFO_TIME } from 'common/upbit';
import { CoinTickerDto } from './dtos/coin-ticker.dto';

@Injectable()
export class OrderbookService implements OnModuleInit{
	private websocket: WebSocket;
	private sending: Boolean = false;
	private timeoutId: NodeJS.Timeout | null = null;

	constructor(
		private readonly coinListService: CoinListService,
		private readonly sseService: SseService
	) {};

	onModuleInit() {
		this.websocket = new WebSocket(UPBIT_WEBSOCKET_URL);
		this.connectWebSocket()
	}

	connectWebSocket() {
		this.websocket.on('open', () => {
			try {
				console.log('OrderbookWebSocket 연결이 열렸습니다.');
				this.sendWebSocket();
			} catch (error) {
				console.error('sendWebSocket 실행 중 오류 발생:', error);
			}
		});
		this.websocket.on('message', (data) => {
			try {
				const message = JSON.parse(data.toString());
				this.sseService.orderbookSendEvent(message);
			} catch (error) {
				console.error('OrderbookWebSocket 메시지 처리 중 오류 발생:', error);
			}
		});
		this.websocket.on('close', () => {
			try {
				console.log('OrderbookWebSocket 연결이 닫혔습니다. 재연결 시도 중...');
				setTimeout(() => this.connectWebSocket(), UPBIT_WEBSOCKET_CONNECTION_TIME);
			} catch (error) {
				console.error('OrderbookWebSocket 재연결 설정 중 오류 발생:', error);
			}
		});

		this.websocket.on('error', (error) => {
			console.error('OrderbookWebSocket 오류:', error);
		});
	}
	async sendWebSocket() {
		if (this.sending) return;
		this.sending = true;
		try{
			const coin_list = this.coinListService.getCoinNameList();
			const subscribeMessage = JSON.stringify([
				{ ticket: 'test' },
				{ type: 'ticker', codes: coin_list },
			]);
			this.websocket.send(subscribeMessage);
		}catch(error){
			console.error('OrderbookWebSocket 오류:', error);
		}finally{
			this.sending = false;
			if (this.timeoutId) clearTimeout(this.timeoutId);
			this.timeoutId = setTimeout(() => this.sendWebSocket(), UPBIT_UPDATED_ORDER_INFO_TIME);
		}
	}
}
