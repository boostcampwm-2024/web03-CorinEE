import {
  BadRequestException,
  Injectable,
  OnModuleInit,
  UnprocessableEntityException,
} from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { TRANSACTION_CHECK_INTERVAL } from './constants/trade.constants';
import { formatQuantity, isMinimumQuantity } from './helpers/trade.helper';
import {
  OrderBookEntry,
  TradeData,
  TradeResponse,
} from './dtos/trade.interface';
import { UPBIT_UPDATED_COIN_INFO_TIME } from '../upbit/constants';
import { TradeNotFoundException } from './exceptions/trade.exceptions';
import { TradeAskBidService } from './trade-ask-bid.service';

@Injectable()
export class BidService extends TradeAskBidService implements OnModuleInit {
  private transactionCreateBid: boolean = false;
  private isProcessing: { [key: number]: boolean } = {};

  onModuleInit() {
    this.startPendingTradesProcessor();
  }

  private startPendingTradesProcessor() {
    const processBidTrades = async () => {
      try {
        await this.processPendingTrades('BUY', this.bidTradeService.bind(this));
      } finally {
        setTimeout(processBidTrades, UPBIT_UPDATED_COIN_INFO_TIME);
      }
    };
    processBidTrades();
  }

  async calculatePercentBuy(
    user: any,
    moneyType: string,
    percent: number,
  ): Promise<number> {
    const account = await this.accountRepository.findOne({
      where: { user: { id: user.userId } },
    });

    const balance = account[moneyType];
    return formatQuantity(balance * (percent / 100));
  }

  async createBidTrade(user: any, bidDto: TradeData): Promise<TradeResponse> {
    if (isMinimumQuantity(bidDto.receivedAmount * bidDto.receivedPrice)) {
      throw new BadRequestException('최소 거래 금액보다 작습니다.');
    }

    if (this.transactionCreateBid) {
      await this.waitForTransaction(() => this.transactionCreateBid);
    }
    this.transactionCreateBid = true;

    try {
      return await this.executeTransaction(async (queryRunner) => {
        if (bidDto.receivedAmount <= 0) {
          throw new BadRequestException('수량은 0보다 커야 합니다.');
        }

        const userAccount = await this.accountRepository.validateUserAccount(
          user.userId,
        );
        const accountBalance = await this.checkCurrencyBalance(
          bidDto,
          userAccount,
        );

        await this.accountRepository.updateAccountCurrency(
          bidDto.typeGiven,
          accountBalance,
          userAccount.id,
          queryRunner,
        );

        await this.tradeRepository.createTrade(
          bidDto,
          user.userId,
          'buy',
          queryRunner,
        );

        return {
          statusCode: 200,
          message: '거래가 정상적으로 등록되었습니다.',
        };
      });
    } finally {
      this.transactionCreateBid = false;
    }
  }

  private async checkCurrencyBalance(
    bidDto: TradeData,
    account: any,
  ): Promise<number> {
    const { typeGiven, receivedPrice, receivedAmount } = bidDto;
    const balance = account[typeGiven];

    const givenAmount = formatQuantity(receivedPrice * receivedAmount);
    const remaining = formatQuantity(balance - givenAmount);

    if (remaining < 0) {
      throw new UnprocessableEntityException('자산이 부족합니다.');
    }

    return remaining;
  }

  private async bidTradeService(bidDto: TradeData): Promise<void> {
    if (this.isProcessing[bidDto.tradeId]) {
      return;
    }

    this.isProcessing[bidDto.tradeId] = true;

    try {
      const { userId, typeGiven } = bidDto;
      // 트랜잭션 없이 계정 조회
      const account = await this.accountRepository.findOne({
        where: { user: { id: userId } },
      });

      bidDto.accountBalance = account[typeGiven];
      bidDto.account = account;

      const orderbook =
        this.coinDataUpdaterService.getCoinOrderbookByBid(bidDto);

      for (const order of orderbook) {
        try {
          if (order.ask_price > bidDto.receivedPrice) break;
          const tradeResult = await this.executeTransaction(
            async (queryRunner) => {
              const remainingQuantity = await this.executeBidTrade(
                bidDto,
                order,
                queryRunner,
              );

              return !isMinimumQuantity(remainingQuantity);
            },
          );

          if (!tradeResult) break;
        } catch (error) {
          if (error instanceof TradeNotFoundException) {
            break;
          }
          throw error;
        }
      }
    } finally {
      delete this.isProcessing[bidDto.tradeId];
    }
  }

  private async executeBidTrade(
    bidDto: TradeData,
    order: OrderBookEntry,
    queryRunner: QueryRunner,
  ): Promise<number> {
    const tradeData = await this.tradeRepository.findTradeWithLock(
      bidDto.tradeId,
      queryRunner,
    );

    if (!tradeData || isMinimumQuantity(tradeData.quantity)) {
      return 0;
    }
    const { ask_price, ask_size } = order;
    const { userId, account, typeReceived, krw } = bidDto;

    const buyData = { ...tradeData };
    buyData.quantity = formatQuantity(
      tradeData.quantity >= ask_size ? ask_size : tradeData.quantity,
    );

    if (isMinimumQuantity(buyData.quantity)) {
      return 0;
    }

    buyData.price = formatQuantity(ask_price * krw);
    const user = await this.userRepository.getUser(userId);

    await this.tradeHistoryRepository.createTradeHistory(
      user,
      buyData,
      queryRunner,
    );

    const asset = await this.assetRepository.getAsset(
      account.id,
      typeReceived,
      queryRunner,
    );

    await this.processAssetUpdate(bidDto, asset, buyData, queryRunner);
    await this.updateAccountBalances(bidDto, buyData, queryRunner);
    return await this.updateTradeData(tradeData, buyData, queryRunner);
  }

  private async processAssetUpdate(
    bidDto: TradeData,
    asset: any,
    buyData: any,
    queryRunner: QueryRunner,
  ): Promise<void> {
    if (asset) {
      asset.price = formatQuantity(
        asset.price + buyData.price * buyData.quantity,
      );
      asset.quantity = formatQuantity(asset.quantity + buyData.quantity);
      asset.availableQuantity = formatQuantity(
        asset.availableQuantity + buyData.quantity,
      );

      await this.assetRepository.updateAssetQuantityPrice(asset, queryRunner);
    } else {
      await this.assetRepository.createAsset(
        bidDto.typeReceived,
        bidDto.account,
        formatQuantity(buyData.price * buyData.quantity),
        formatQuantity(buyData.quantity),
        queryRunner,
      );
    }
  }

  private async updateAccountBalances(
    bidDto: TradeData,
    buyData: any,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const { account, typeGiven, typeReceived } = bidDto;

    if (typeReceived === 'BTC') {
      const btcQuantity = formatQuantity(account.BTC + buyData.quantity);
      await this.accountRepository.updateAccountBTC(
        account.id,
        btcQuantity,
        queryRunner,
      );
    }

    const change = formatQuantity(
      (bidDto.receivedPrice - buyData.price) * buyData.quantity,
    );
    const returnChange = formatQuantity(change + account[typeGiven]);

    await this.accountRepository.updateAccountCurrency(
      typeGiven,
      returnChange,
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
