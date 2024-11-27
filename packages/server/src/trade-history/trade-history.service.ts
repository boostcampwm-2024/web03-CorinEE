import {
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { TradeHistoryRepository } from './trade-history.repository';
import { TradeHistoryResponseDto } from './dtos/trade-history.dto';
import { TradeHistory } from './trade-history.entity';
import { UserDto } from '@src/account/dtos/my-account.response.dto';

@Injectable()
export class TradeHistoryService {
  private readonly logger = new Logger(TradeHistoryService.name);

  constructor(
    private readonly tradeHistoryRepository: TradeHistoryRepository,
  ) {}

  async getMyTradeHistoryData(
    user: UserDto,
    coin?: string,
  ): Promise<TradeHistoryResponseDto> {
    this.logger.log(`거래 내역 조회 시작: userId=${user.userId}`);

    try {
      const tradeHistories = await this.tradeHistoryRepository.find({
        where: { user: { id: user.userId } },
        order: { createdAt: 'DESC' },
      });

      if (tradeHistories.length === 0) {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: '거래 내역이 없습니다.',
          tradeData: [],
        };
      }

      let filteredHistories = tradeHistories;
      if (coin) {
        const [assetName, tradeCurrency] = coin.split('-');
        filteredHistories = this.filterTradeHistories(
          tradeHistories,
          assetName,
          tradeCurrency,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        message: '거래 내역을 찾았습니다.',
        tradeData: filteredHistories,
      };
    } catch (error) {
      this.logger.error(`거래 내역 조회 실패: ${error.message}`, error.stack);
      throw error;
    }
  }

  private filterTradeHistories(
    histories: TradeHistory[],
    assetName: string,
    tradeCurrency: string,
  ): TradeHistory[] {
    return histories.filter(
      ({ assetName: a, tradeCurrency: t }) =>
        (a === assetName && t === tradeCurrency) ||
        (a === tradeCurrency && t === assetName),
    );
  }
}
