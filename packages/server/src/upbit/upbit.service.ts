import { Injectable, OnModuleInit } from '@nestjs/common';
import * as WebSocket from 'ws';
import { SseService } from './sse.service';
import { CoinListService } from './coin-list.service';
import { UPBIT_WEBSOCKET_CONNECTION_TIME, UPBIT_WEBSOCKET_URL } from 'common/upbit';
import { CoinTickerDto } from './dtos/coin-ticker.dto';

@Injectable()
export class UpbitService implements OnModuleInit{
	private websocket: WebSocket;

	constructor(
		private readonly coinListService: CoinListService,
		private readonly sseService: SseService
	) {};

	onModuleInit() {
		this.websocket = new WebSocket(UPBIT_WEBSOCKET_URL);
		this.connectWebSocket()
	}

	connectWebSocket() {
		this.websocket.on('open', async () => {
			await this.coinListService.getCoinListFromUpbit();
			const coin_list = this.coinListService.getAllCoinList();
			console.log('WebSocket 연결 성공');
			const subscribeMessage = JSON.stringify([
				{ ticket: 'test' },
				{ type: 'ticker', codes: coin_list }, 
			]);
			this.websocket.send(subscribeMessage);
		});

		this.websocket.on('close', () => {
			console.log('WebSocket 연결이 닫혔습니다. 재연결 시도 중...');
			setTimeout(() => this.connectWebSocket(), UPBIT_WEBSOCKET_CONNECTION_TIME);
		});

		this.websocket.on('error', (error) => {
			console.error('WebSocket 오류:', error);
		});
	}
	sendWebSocket(dtoMethod: Function, coins: string[]){
		let message;
		this.websocket.on('message', (data) => {
			message = JSON.parse(data.toString());
			const temp = coins.includes(message.code) ? this.coinListService.tempCoinAddNameAndUrl(message) : null;
			this.sseService.sendEvent(temp);
			//현재는 전부 보냅니다.
			// const coinTick: CoinTickerDto = dtoMethod(message);
			// this.sseService.sendEvent(coinTick);
		});
	}
}
