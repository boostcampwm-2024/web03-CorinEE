import { Injectable, OnModuleInit } from '@nestjs/common';
import * as WebSocket from 'ws';
import { SseService } from './sse.service';
import { CoinListService } from './coin-list.service';
import { UPBIT_WEBSOCKET_CONNECTION_TIME, UPBIT_WEBSOCKET_URL } from 'common/upbit';
import { CoinTickerDto } from './dtos/coin-ticker.dto';

@Injectable()
export class UpbitService implements OnModuleInit {
	private websocket: WebSocket;

	constructor(
		private readonly coinListService: CoinListService,
		private readonly sseService: SseService
	) {};

	onModuleInit() {
		this.connectWebSocket();
	}

	private async connectWebSocket() {
		await this.coinListService.getCoinListFromUpbit();
		const coin_list = this.coinListService.getCoinList();
		
		this.websocket = new WebSocket(UPBIT_WEBSOCKET_URL);
		
		this.websocket.on('open', () => {
			console.log('WebSocket 연결 성공');
			const subscribeMessage = JSON.stringify([
				{ ticket: 'test' },
				{ type: 'ticker', codes: coin_list }, 
			]);
			this.websocket.send(subscribeMessage);
		});

		this.websocket.on('message', (data) => {
			const message : string = data.toString();
			const coinTick: CoinTickerDto = this.coinListService.convertToTickerDTO(message);
			this.sseService.sendEvent(coinTick);
		});

		this.websocket.on('close', () => {
			console.log('WebSocket 연결이 닫혔습니다. 재연결 시도 중...');
			setTimeout(() => this.connectWebSocket(), UPBIT_WEBSOCKET_CONNECTION_TIME);
		});

		this.websocket.on('error', (error) => {
			console.error('WebSocket 오류:', error);
		});
	}
}
