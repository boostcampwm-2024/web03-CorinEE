import { Injectable, OnModuleInit } from '@nestjs/common';
import { Subject } from 'rxjs';
import * as WebSocket from 'ws';
import { SseService } from './sse.service';
import { CoinListService } from './coin-list.service';

@Injectable()
export class UpbitService implements OnModuleInit {
	private ws: WebSocket;

	constructor(
		private readonly coinListService: CoinListService,
		private readonly sseService: SseService
	) {};

	onModuleInit() {
		this.connectWebSocket();
	}

	private async connectWebSocket() {
		const coin_list = await this.coinListService.getCoinList()
		this.ws = new WebSocket('wss://api.upbit.com/websocket/v1');

		this.ws.on('open', () => {
			console.log('WebSocket 연결 성공');
			// 구독할 마켓 설정
			const subscribeMessage = JSON.stringify([
				{ ticket: 'test' },
				{ type: 'ticker', codes: coin_list.map((coin)=>coin.market) }, // 원하는 코인 추가
			]);
			this.ws.send(subscribeMessage);
		});

		this.ws.on('message', (data) => {
      //TODO: upbitTickerDto 타입으로 변경
			const message = JSON.parse(data.toString());
      this.sseService.sendEvent(message);
		});

		this.ws.on('close', () => {
			console.log('WebSocket 연결이 닫혔습니다. 재연결 시도 중...');
			setTimeout(() => this.connectWebSocket(), 3000); // 재연결 로직
		});

		this.ws.on('error', (error) => {
			console.error('WebSocket 오류:', error);
		});
	}
}
