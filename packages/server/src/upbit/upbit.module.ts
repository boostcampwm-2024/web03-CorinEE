import { Module, Global } from '@nestjs/common';
import { CoinTickerService } from './coin-ticker-websocket.service';
import { UpbitController } from './upbit.controller';
import { CoinListService } from './coin-list.service';
import { HttpModule } from '@nestjs/axios';
import { SseService } from './sse.service';
import { OrderbookService } from './orderbook-websocket.service';
import { CoinDataUpdaterService } from './coin-data-updater.service';
import { ChartService } from './chart.service';

@Global()
@Module({
	imports: [HttpModule],
	providers: [
		CoinTickerService,
		CoinListService,
		SseService,
		OrderbookService,
		CoinDataUpdaterService,
		ChartService,
	],
	controllers: [UpbitController],
	exports: [CoinDataUpdaterService],
})
export class UpbitModule {}
