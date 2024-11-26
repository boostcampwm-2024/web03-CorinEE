import {
  BadRequestException,
  Injectable,
  OnModuleInit,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UPBIT_UPDATED_COIN_INFO_TIME } from '../upbit/constants';
import {
  OrderBookEntry,
  TradeData,
  TradeResponse,
} from './dtos/trade.interface';
import { formatQuantity, isMinimumQuantity } from './helpers/trade.helper';
import { QueryRunner } from 'typeorm';
import { TRANSACTION_CHECK_INTERVAL } from './constants/trade.constants';
import { TradeNotFoundException } from './exceptions/trade.exceptions';
import { TradeAskBidService } from './trade-ask-bid.service';

@Injectable()
export class AskService extends TradeAskBidService implements OnModuleInit {
  private isProcessing: { [key: number]: boolean } = {};
  private transactionCreateAsk: boolean = false;

  onModuleInit() {
    this.startPendingTradesProcessor();
  }

  private startPendingTradesProcessor() {
    const processAskTrades = async () => {
      try {
        await this.processPendingTrades(
          'SELL',
          this.askTradeService.bind(this),
        );
      } finally {
        setTimeout(processAskTrades, UPBIT_UPDATED_COIN_INFO_TIME);
      }
    };
    processAskTrades();
  }

  async calculatePercentSell(
    user: any,
    assetType: string,
    percent: number,
  ): Promise<number> {
    const account = await this.accountRepository.findOne({
      where: { user: { id: user.userId } },
    });

    const asset = await this.assetRepository.findOne({
      where: {
        account: { id: account.id },
        assetName: assetType,
      },
    });

    if (!asset) return 0;
    return formatQuantity(asset.quantity * (percent / 100));
  }

  async createAskTrade(user: any, askDto: TradeData): Promise<TradeResponse> {
    if (isMinimumQuantity(askDto.receivedAmount * askDto.receivedPrice)) {
      throw new BadRequestException('최소 거래 금액보다 작습니다.');
    }

    if (this.transactionCreateAsk) {
      await this.waitForTransaction(() => this.transactionCreateAsk);
    }
    this.transactionCreateAsk = true;

    try {
      return await this.executeTransaction(async (queryRunner) => {
        if (askDto.receivedAmount <= 0) {
          throw new BadRequestException('수량은 0보다 커야 합니다.');
        }

        const userAccount = await this.accountRepository.validateUserAccount(
          user.userId,
        );
        const userAsset = await this.checkAssetAvailability(
          askDto,
          userAccount,
          queryRunner,
        );

        await this.tradeRepository.createTrade(
          askDto,
          user.userId,
          'sell',
          queryRunner,
        );

        userAsset.availableQuantity = formatQuantity(
          userAsset.availableQuantity - askDto.receivedAmount,
        );

        await this.assetRepository.updateAssetAvailableQuantity(
          userAsset,
          queryRunner,
        );

        return {
          statusCode: 200,
          message: '거래가 정상적으로 등록되었습니다.',
        };
      });
    } finally {
      this.transactionCreateAsk = false;
    }
  }

  private async checkAssetAvailability(
    askDto: TradeData,
    account: any,
    queryRunner: QueryRunner,
  ) {
    const userAsset = await this.assetRepository.getAsset(
      account.id,
      askDto.typeGiven,
      queryRunner,
    );

    if (!userAsset) {
      throw new UnprocessableEntityException({
        message: '자산이 부족합니다.',
        statusCode: 422,
      });
    }

    const availableBalance =
      userAsset.availableQuantity - askDto.receivedAmount;

    if (availableBalance < 0) {
      throw new UnprocessableEntityException({
        message: '자산이 부족합니다.',
        statusCode: 422,
      });
    }

    return userAsset;
  }

  private async askTradeService(askDto: TradeData): Promise<void> {
    if (this.isProcessing[askDto.tradeId]) {
      return;
    }
    this.isProcessing[askDto.tradeId] = true;
    try {
      const orderbook =
        this.coinDataUpdaterService.getCoinOrderbookByAsk(askDto);

      for (const order of orderbook) {
        if (order.bid_price < askDto.receivedPrice) break;
        await this.executeTransaction(async (queryRunner) => {
          const remainingQuantity = await this.executeAskTrade(
            askDto,
            order,
            queryRunner,
          );

          return !isMinimumQuantity(remainingQuantity);
        });
      }
    } catch (error) {
      if (error instanceof TradeNotFoundException) {
        return;
      }
      throw error;
    } finally {
      delete this.isProcessing[askDto.tradeId];
    }
  }

  private async executeAskTrade(
    askDto: TradeData,
    order: OrderBookEntry,
    queryRunner: QueryRunner,
  ): Promise<number> {
    const tradeData = await this.tradeRepository.findTradeWithLock(
      askDto.tradeId,
      queryRunner,
    );

    if (!tradeData || isMinimumQuantity(tradeData.quantity)) {
      return 0;
    }

    const account = await this.accountRepository.getAccount(
      askDto.userId,
      queryRunner,
    );

    const userAsset = await this.assetRepository.getAsset(
      account.id,
      askDto.typeGiven,
      queryRunner,
    );

    if (userAsset) {
      askDto.assetBalance = userAsset.quantity;
      askDto.asset = userAsset;
    }
    const { bid_price, bid_size } = order;
    const { userId, asset, krw } = askDto;

    const buyData = { ...tradeData };
    buyData.quantity = formatQuantity(
      tradeData.quantity >= bid_size ? bid_size : tradeData.quantity,
    );

    if (isMinimumQuantity(buyData.quantity)) {
      return 0;
    }

    buyData.price = formatQuantity(bid_price * krw);
    const user = await this.userRepository.getUser(userId);

    const assetName = buyData.assetName;
    buyData.assetName = buyData.tradeCurrency;
    buyData.tradeCurrency = assetName;

    await Promise.all([
      this.tradeHistoryRepository.createTradeHistory(
        user,
        buyData,
        queryRunner,
      ),
      this.processAssetUpdate(asset, buyData, queryRunner),
      this.updateAccountBalances(askDto, buyData, queryRunner),
    ]);

    return await this.updateTradeData(tradeData, buyData, queryRunner);
  }

  private async processAssetUpdate(
    asset: any,
    buyData: any,
    queryRunner: QueryRunner,
  ): Promise<void> {
    asset.quantity = formatQuantity(asset.quantity - buyData.quantity);
    asset.price = formatQuantity(
      asset.price - buyData.price * buyData.quantity,
    );

    if (isMinimumQuantity(asset.quantity)) {
      await this.assetRepository.delete({
        assetId: asset.assetId,
      });
    } else {
      await this.assetRepository.updateAssetPrice(asset, queryRunner);
    }
  }

  private async updateAccountBalances(
    askDto: TradeData,
    buyData: any,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const account = await this.accountRepository.findOne({
      where: { user: { id: askDto.userId } },
    });

    if (askDto.typeGiven === 'BTC') {
      const btcQuantity = account.BTC - buyData.quantity;
      await this.accountRepository.updateAccountBTC(
        account.id,
        btcQuantity,
        queryRunner,
      );
    }

    const change = formatQuantity(
      account[askDto.typeReceived] + buyData.price * buyData.quantity,
    );

    await this.accountRepository.updateAccountCurrency(
      askDto.typeReceived,
      change,
      account.id,
      queryRunner,
    );
  }

  private async waitForTransaction(
    checkCondition: () => boolean,
  ): Promise<void> {
    return new Promise<void>((resolve) => {
      const check = () => {
        if (!checkCondition()) resolve();
        else setTimeout(check, TRANSACTION_CHECK_INTERVAL);
      };
      check();
    });
  }
}
