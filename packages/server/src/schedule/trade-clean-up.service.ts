import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TradeRepository } from '../trade/trade.repository'; // TradeDB Repository
import { TradeRedisRepository } from '@src/redis/trade-redis.repository';

@Injectable()
export class TradeCleanupService {
	private readonly logger = new Logger(TradeCleanupService.name);

	constructor(
		private readonly redisRepository: TradeRedisRepository,
		private readonly tradeRepository: TradeRepository,
	) {}

	@Cron('*/1 * * * *')
	async handleOrphanTradeCleanup(): Promise<void> {
		if (process.env.NODE_ENV === 'production') {
			const dbTradeIds = await this.tradeRepository.getAllTradeIds();
			await this.redisRepository.cleanupOrphanTrades(dbTradeIds);
		} else {
			console.log('Cron job skipped: NODE_ENV is not production');
		}
	}
}
