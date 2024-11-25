import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TradeHistoryRepository } from '../trade-history/trade-history.repository';

@Injectable()
export class TradeHistoryService {
  constructor(
    private tradehistoryRepository: TradeHistoryRepository,
    private readonly dataSource: DataSource,
  ) {}

  async getMyTradeHistoryData(user, coin) {
    try {
      let tradehistoryData = await this.tradehistoryRepository.find({
        where: { user: { id: user.userId } },
      });

      if (tradehistoryData.length === 0) {
        return {
          statusCode: 201,
          message: '거래 내역이 없습니다.',
          result: [],
        };
      }

      if (coin) {
        const [assetName, tradeCurrency] = coin.split('-');
        tradehistoryData = tradehistoryData.filter(
          ({ assetName: a, tradeCurrency: t }) =>
            (a === assetName && t === tradeCurrency) ||
            (a === tradeCurrency && t === assetName),
        );
      }

      return {
        statusCode: 200,
        message: '거래 내역을 찾았습니다.',
        result: tradehistoryData,
      };
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
