import { Injectable, OnModuleInit } from '@nestjs/common';
import * as WebSocket from 'ws';

@Injectable()
export class UpbitService implements OnModuleInit {
	private ws: WebSocket;
  private priceUpdates$: Subject<any> = new Subject(); // SSE로 전달할 스트림 생성

	onModuleInit() {
		this.connectWebSocket();
	}

	private connectWebSocket() {
		this.ws = new WebSocket('wss://api.upbit.com/websocket/v1');

		this.ws.on('open', () => {
			console.log('WebSocket 연결 성공');
			const subscribeMessage = JSON.stringify([
				{ ticket: 'test' },
				{ type: 'ticker', codes: ['KRW-BTC', 'KRW-ETH'] }, // 원하는 코인 추가
			]);
			this.websocket.send(subscribeMessage);
		});

		this.ws.on('message', (data) => {
      //TODO: upbitTicker 타입으로 변경
			const message = JSON.parse(data.toString());
      this.sseService.sendEvent(message);
		});

		this.websocket.on('close', () => {
			console.log('WebSocket 연결이 닫혔습니다. 재연결 시도 중...');
			setTimeout(() => this.connectWebSocket(), UPBIT_WEBSOCKET_CONNECTION_TIME);
		});

		this.websocket.on('error', (error) => {
			console.error('WebSocket 오류:', error);
		});
	}
	async sendWebSocket(){
		await this.coinListService.getCoinListFromUpbit();
		const coin_list = this.coinListService.getAllCoinList();
		console.log('WebSocket 연결 성공');
		const subscribeMessage = JSON.stringify([
			{ ticket: 'test' },
			{ type: 'ticker', codes: coin_list }, 
		]);
		this.websocket.send(subscribeMessage);
	}
}
