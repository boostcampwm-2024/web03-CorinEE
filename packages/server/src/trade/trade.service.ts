import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { AccountRepository } from 'src/account/account.repository';
import { AssetRepository } from 'src/asset/asset.repository';
import { TradeRepository } from './trade.repository';
import { CoinDataUpdaterService } from 'src/upbit/coin-data-updater.service';
import { UPBIT_IMAGE_URL } from '@src/upbit/constants';
import { TradeDataDto } from './dtos/tradeData.dto';
import { TradeDeleteFailedException } from './exceptions/trade.exceptions';
import { MINIMUM_TRADE_AMOUNT, TRADE_TYPES } from './constants/trade.constants';
import { TradeResponse } from './dtos/trade.interface';
import { TradeHistoryRepository } from '../trade-history/trade-history.repository';
import { UserRepository } from '@src/auth/user.repository';

@Injectable()
export class TradeService {
  private readonly logger = new Logger(TradeService.name);

  constructor(
    protected readonly dataSource: DataSource,
    protected readonly accountRepository: AccountRepository,
    protected readonly assetRepository: AssetRepository,
    protected readonly tradeRepository: TradeRepository,
    protected readonly userRepository: UserRepository,
    protected readonly tradeHistoryRepository: TradeHistoryRepository,
    protected readonly coinDataUpdaterService: CoinDataUpdaterService,
  ) {}

  async checkMyCoinData(user: any, coin: string): Promise<TradeResponse> {
    try {
      const account = await this.accountRepository.findOne({
        where: { user: { id: user.userId } },
      });

      if (!account) {
        return {
          statusCode: 400,
          message: '등록되지 않은 사용자입니다.',
        };
      }

      const coinData = await this.assetRepository.findOne({
        where: {
          account: { id: account.id },
          assetName: coin,
        },
      });

      return {
        statusCode: coinData ? 200 : 201,
        message: coinData
          ? '보유하고 계신 코인입니다.'
          : '보유하지 않은 코인입니다.',
        own: coinData ? true : false,
      };
    } catch (error) {
      this.logger.error('코인 데이터 조회 실패', {
        error: error.stack,
        userId: user.userId,
      });
      throw error;
    }
  }

  async getMyTradeData(user: any, coin?: string): Promise<TradeResponse> {
    try {
      let tradeData = await this.tradeRepository.find({
        where: { user: { id: user.userId } },
      });

      if (tradeData.length === 0) {
        return {
          statusCode: 201,
          message: '미체결 데이터가 없습니다.',
          result: [],
        };
      }

      const coinNameData = this.coinDataUpdaterService.getCoinNameList();

      if (coin) {
        tradeData = this.filterTradesByCoin(tradeData, coin);
      }

      const result = this.mapTradeDataToDto(tradeData, coinNameData, user);

      return {
        statusCode: 200,
        message: '미체결 데이터가 있습니다.',
        result,
      };
    } catch (error) {
      this.logger.error('미체결 데이터 조회 실패', {
        error: error.stack,
        userId: user.userId,
      });
      throw error;
    }
  }

  private filterTradesByCoin(trades: any[], coin: string): any[] {
    const [assetName, tradeCurrency] = coin.split('-');
    return trades.filter(
      ({ assetName: a, tradeCurrency: t }) =>
        (a === assetName && t === tradeCurrency) ||
        (a === tradeCurrency && t === assetName),
    );
  }

  private mapTradeDataToDto(
    trades: any[],
    coinNameData: Map<string, string>,
    user: any,
  ): TradeDataDto[] {
    return trades.map((trade) => {
      const name =
        trade.tradeType === TRADE_TYPES.BUY
          ? trade.tradeCurrency
          : trade.assetName;
      const tradeType = trade.tradeType;

      return {
        img_url: `${UPBIT_IMAGE_URL}${name}.png`,
        koreanName:
          coinNameData.get(`${trade.assetName}-${trade.tradeCurrency}`) ||
          coinNameData.get(`${trade.tradeCurrency}-${trade.assetName}`),
        coin:
          tradeType === TRADE_TYPES.BUY ? trade.assetName : trade.tradeCurrency,
        market:
          tradeType === TRADE_TYPES.SELL
            ? trade.assetName
            : trade.tradeCurrency,
        tradeId: trade.tradeId,
        tradeType,
        price: trade.price,
        quantity: trade.quantity,
        createdAt: trade.createdAt,
        userId: user.userId,
      };
    });
  }

  async deleteMyBidTrade(user: any, tradeId: number): Promise<TradeResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');

    try {
      const trade = await this.tradeRepository.findTradeWithLock(
        tradeId,
        queryRunner,
      );

      await this.tradeRepository.deleteTrade(tradeId, queryRunner);

      const userAccount = await this.accountRepository.findOne({
        where: { user: { id: user.userId } },
      });

      const accountBalance = this.calculateAccountBalance(trade, userAccount);

      await this.accountRepository.updateAccountCurrency(
        'availableKRW',
        accountBalance,
        userAccount.id,
        queryRunner,
      );
      await queryRunner.commitTransaction();

      return {
        statusCode: 200,
        message: '거래가 성공적으로 취소되었습니다.',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('매수 거래 취소 실패', {
        error: error.stack,
        tradeId,
        userId: user.userId,
      });
      throw new TradeDeleteFailedException(tradeId, error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async deleteMyAskTrade(user: any, tradeId: number): Promise<TradeResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');

    try {
      const trade = await this.tradeRepository.findTradeWithLock(
        tradeId,
        queryRunner,
      );

      await this.tradeRepository.deleteTrade(tradeId, queryRunner);

      const userAccount = await this.accountRepository.findOne({
        where: { user: { id: user.userId } },
      });

      const userAsset = await this.assetRepository.findOne({
        where: {
          account: { id: userAccount.id },
          assetName: trade.tradeCurrency,
        },
      });

      userAsset.availableQuantity = this.calculateAvailableQuantity(
        userAsset,
        trade,
      );

      await this.assetRepository.updateAssetAvailableQuantity(
        userAsset,
        queryRunner,
      );
      await queryRunner.commitTransaction();

      return {
        statusCode: 200,
        message: '거래가 성공적으로 취소되었습니다.',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('매도 거래 취소 실패', {
        error: error.stack,
        tradeId,
        userId: user.userId,
      });
      throw new TradeDeleteFailedException(tradeId, error.message);
    } finally {
      await queryRunner.release();
    }
  }

  private calculateAccountBalance(trade: any, userAccount: any): number {
    return parseFloat(
      (trade.price * trade.quantity + userAccount.availableKRW).toFixed(
        8,
      ),
    );
  }

  private calculateAvailableQuantity(userAsset: any, trade: any): number {
    return parseFloat(
      (userAsset.availableQuantity + trade.quantity).toFixed(8),
    );
  }

  protected async createTradeHistory(
    user: any,
    tradeData: any,
    queryRunner: QueryRunner,
  ): Promise<void> {
    await this.tradeHistoryRepository.createTradeHistory(
      user,
      tradeData,
      queryRunner,
    );
  }

  protected async updateAsset(
    asset: any,
    quantity: number,
    price: number,
    queryRunner: QueryRunner,
  ): Promise<void> {
    if (quantity < MINIMUM_TRADE_AMOUNT) {
      await this.assetRepository.delete({ assetId: asset.assetId });
      return;
    }

    await this.assetRepository.updateAssetQuantityPrice(
      { ...asset, quantity, price },
      queryRunner,
    );
  }

  protected async updateBTCBalance(
    accountId: number,
    quantity: number,
    queryRunner: QueryRunner,
  ): Promise<void> {
    await this.accountRepository.updateAccountBTC(
      accountId,
      quantity,
      queryRunner,
    );
  }

  protected validateTradeAmount(amount: number, price: number): void {
    if (amount * price < MINIMUM_TRADE_AMOUNT || amount <= 0) {
      throw new BadRequestException('유효하지 않은 거래 금액입니다.');
    }
  }
}
