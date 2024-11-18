import {
  Injectable,
  OnModuleInit,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AccountRepository } from 'src/account/account.repository';
import { AssetRepository } from 'src/asset/asset.repository';
import { TradeRepository } from './trade.repository';
import { CoinDataUpdaterService } from 'src/upbit/coin-data-updater.service';
import { TradeHistoryRepository } from '../trade-history/trade-history.repository';
import { UPBIT_UPDATED_COIN_INFO_TIME } from 'common/upbit';

@Injectable()
export class TradeService implements OnModuleInit {
  private transactionBuy: boolean = false;
  private matchPendingTradesTimeoutId: NodeJS.Timeout | null = null;

  constructor(
    private accountRepository: AccountRepository,
    private assetRepository: AssetRepository,
    private tradeRepository: TradeRepository,
    private coinDataUpdaterService: CoinDataUpdaterService,
    private readonly dataSource: DataSource,
    private tradeHistoryRepository: TradeHistoryRepository,
  ) {}

  onModuleInit() {
    this.matchPendingTrades();
  }

  async calculatePercentBuy(user, moneyType: string, percent: number) {
    const money = await this.accountRepository.getMyMoney(user, moneyType);

    return Number(money) * (percent / 100);
  }
  async createBuyTrade(buyDto) {
    const tradeId = await this.tradeRepository.createTrade(buyDto);
    buyDto.tradeId = tradeId;
    return buyDto;
  }

  async buyTradeService(buyDto) {
    if (this.transactionBuy) await this.waitForTransactionOrder();
    this.transactionBuy = true;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const [accountBalance, account] = await this.checkCurrency(buyDto);
      // 일단 호가창 체크 안하고 현재가 기준으로만 체결
      const currentCoinPrice = this.coinDataUpdaterService.getCoinPrice(buyDto);
      if (buyDto.receivedPrice < currentCoinPrice) {
        await queryRunner.commitTransaction();
        return {
          code: 204,
          message: '아직 체결되지 않았습니다.',
        };
      }

      const tradeData = await this.tradeRepository.deleteTrade(
        buyDto.tradeId,
        queryRunner,
      );
      await this.tradeHistoryRepository.createTradeHistory(
        buyDto.userId,
        tradeData,
        queryRunner,
      );

      const afterTradeBalance =
        accountBalance - currentCoinPrice * buyDto.receivedAmount;
      await this.assetRepository.createAsset(
        buyDto,
        currentCoinPrice,
        account,
        queryRunner,
      );

      const accountId = account.accountId;
      await this.accountRepository.succesBuy(
        buyDto,
        afterTradeBalance,
        accountId,
        queryRunner,
      );

      await queryRunner.commitTransaction();
      return {
        code: 200,
        message: '거래가 체결되었습니다.',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
      this.transactionBuy = false;
    }
  }
  async checkCurrency(buyDto) {
    const { userId, typeGiven, receivedPrice, receivedAmount } = buyDto;
    const givenAmount = receivedPrice * receivedAmount;
    const userAccount = await this.accountRepository.findOne({
      where: {
        user: { id: userId },
      },
    });
    if (!userAccount) {
      throw new UnprocessableEntityException({
        response: {
          message: '유저가 존재하지 않습니다.',
          statusCode: 422,
        },
      });
    }
    const accountBalance = userAccount[typeGiven];
    const accountResult = givenAmount <= accountBalance;
    if (!accountResult)
      throw new UnprocessableEntityException({
        response: {
          message: '자산이 부족합니다.',
          statusCode: 422,
        },
      });
    return [accountBalance, userAccount];
  }
  async waitForTransactionOrder() {
    return new Promise<void>((resolve) => {
      const check = () => {
        if (!this.transactionBuy) resolve();
        else setTimeout(check, 100);
      };
      check();
    });
  }
  async matchPendingTrades() {
    try {
      const coinLatestInfo = this.coinDataUpdaterService.getCoinLatestInfo();
      if (coinLatestInfo.size === 0) return;
      const coinPrice = [];
      coinLatestInfo.forEach((value, key) => {
        const price = value.trade_price;
        const [give, receive] = key.split('-');
        coinPrice.push({ give: give, receive: receive, price: price });
      });
      const availableTrades = await this.tradeRepository.searchTrade(coinPrice);
      availableTrades.forEach((trade) => {
        const buyDto = {
          userId: trade.user.id,
          typeGiven: trade.tradeCurrency,
          typeReceived: trade.assetName,
          receivedPrice: trade.price,
          receivedAmount: trade.quantity,
        };
        this.buyTradeService(buyDto);
      });
    } catch (error) {
      console.error('미체결 거래 처리 오류:', error);
    } finally {
      console.log(`미체결 거래 처리 완료: ${Date()}`);

      if (this.matchPendingTradesTimeoutId)
        clearTimeout(this.matchPendingTradesTimeoutId);
      this.matchPendingTradesTimeoutId = setTimeout(
        () => this.matchPendingTrades(),
        UPBIT_UPDATED_COIN_INFO_TIME,
      );
    }
  }
}