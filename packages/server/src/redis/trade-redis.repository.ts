import { Injectable, Inject, Logger } from '@nestjs/common';
import { TRADE_TYPES } from '@src/trade/constants/trade.constants';
import { CoinPriceDto, TradeDataRedis } from '@src/trade/dtos/trade.interface';
import Redis from 'ioredis';

@Injectable()
export class TradeRedisRepository {
  private readonly logger = new Logger(TradeRedisRepository.name);
  constructor(
    @Inject('TRADE_REDIS_CLIENT') private readonly tradeRedis: Redis,
  ) {}

  async createTrade(tradeData: TradeDataRedis) {
    const sortedSetKey = `${tradeData.tradeType}:${tradeData.assetName}:${tradeData.tradeCurrency}`;
    try {
      await this.tradeRedis.zadd(
        sortedSetKey,
        tradeData.price,
        tradeData.tradeId,
      );
      const tradeInfoKey = `trade:${tradeData.tradeId}`;
      await this.tradeRedis.hset(tradeInfoKey, tradeData);

      return { success: true, data: tradeData };
    } catch (error) {
      console.error('Trade creation error:', error);
      throw new Error('Failed to create trade');
    }
  }

  async findMatchingTrades(
    tradeType: TRADE_TYPES.BUY | TRADE_TYPES.SELL,
    coinPrices: CoinPriceDto[],
  ) {
    const result = [];
    await Promise.all(
      coinPrices.map(async (coinPrice) => {
        const sortedSetKey =
          tradeType === TRADE_TYPES.BUY
            ? `${tradeType}:${coinPrice.receive}:${coinPrice.give}`
            : `${tradeType}:${coinPrice.give}:${coinPrice.receive}`;

        try {
          let trades;
          if (tradeType === TRADE_TYPES.SELL) {
            trades = await this.tradeRedis.zrangebyscore(
              sortedSetKey,
              '-inf',
              coinPrice.price,
              'WITHSCORES',
            );
          } else {
            trades = await this.tradeRedis.zrangebyscore(
              sortedSetKey,
              coinPrice.price,
              '+inf',
              'WITHSCORES',
            );
          }

          const tradePromises = trades.map(async (tradeId, index) => {
            if (index % 2 === 1) return null;

            const tradeInfoKey = `trade:${tradeId}`;
            const tradeInfo = await this.tradeRedis.hgetall(tradeInfoKey);
            if (tradeInfo) {
              result.push(tradeInfo);
            }
          });

          await Promise.all(tradePromises);
        } catch (error) {
          console.error('Trade search error:', error);
          throw new Error('Failed to search trades');
        }
      }),
    );
    return result;
  }
  async deleteTrade(tradeData: TradeDataRedis) {
    const sortedSetKey = `${tradeData.tradeType}:${tradeData.assetName}:${tradeData.tradeCurrency}`;
    try {
      await this.tradeRedis.zrem(sortedSetKey, tradeData.tradeId);
      const tradeInfoKey = `trade:${tradeData.tradeId}`;
      await this.tradeRedis.del(tradeInfoKey);

      return {
        success: true,
        message: `Trade ${tradeData.tradeId} deleted successfully`,
      };
    } catch (error) {
      this.logger.error(`Trade deletion error: ${error}`);
      throw new Error('Failed to delete trade');
    }
  }
}
