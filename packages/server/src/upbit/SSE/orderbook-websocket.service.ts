import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SseService } from './sse.service';
import { CoinListService } from '../coin-list.service';
import {
	UPBIT_WEBSOCKET_URL,
	UPBIT_WEBSOCKET_CONNECTION_TIME,
} from '@src/upbit/constants';
import { BaseWebSocketService } from './base-web-socket.service';
import { CoinDataUpdaterService } from '../coin-data-updater.service';

@Injectable()
export class OrderbookService
	extends BaseWebSocketService
	implements OnModuleInit
{
	constructor(
		private readonly coinListService: CoinListService,
    private readonly coinDataUpdaterService: CoinDataUpdaterService,
		private readonly sseService: SseService,
	) {
		super(OrderbookService.name);
	}

	async onModuleInit() {
    await this.ensureCoinDataInitialized();
		this.connectWebSocket(UPBIT_WEBSOCKET_URL, UPBIT_WEBSOCKET_CONNECTION_TIME);
	}

  private async ensureCoinDataInitialized(): Promise<void> {
    if (this.coinListService.getCoinNameList().length === 1) {
      await this.coinDataUpdaterService.updateCoinList();
    }
  }

	protected handleMessage(data: any) {
		if (data.error) {
			this.logger.error('Orderbook WebSocket 오류:', data);
			return;
		}
		this.sseService.sendEvent('orderbook', data);
	}

	protected getSubscribeMessage(): string {
		const coinList = this.coinListService.getCoinNameList();
		return JSON.stringify([
			{ ticket: 'test' },
			{ type: 'orderbook', codes: coinList },
		]);
	}
}
