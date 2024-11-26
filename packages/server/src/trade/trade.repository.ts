import { DataSource, Repository, QueryRunner, SelectQueryBuilder } from 'typeorm';
import { Trade } from './trade.entity';
import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UserRepository } from 'src/auth/user.repository';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TradeDto } from './dtos/trade.dto';
import { TRADE_TYPES } from './constants/trade.constants';
import { Logger } from 'winston';
import {
  TradeNotFoundException,
  TradeCreateFailedException,
  TradeUpdateFailedException,
  TradeLockFailedException,
} from './exceptions/trade.exceptions';
import { User } from '@src/auth/user.entity';
import { CoinPriceDto } from './dtos/trade.interface';

@Injectable()
export class TradeRepository extends Repository<Trade> {
 constructor(
   private readonly dataSource: DataSource,
   private readonly userRepository: UserRepository,
   @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
 ) {
   super(Trade, dataSource.createEntityManager());
 }

 async createTrade(
  tradeDto: TradeDto,
  userId: number,
  tradeType: string,
  queryRunner: QueryRunner,
): Promise<number> {
  try {
    const user = await this.userRepository.getUser(userId);

    this.userRepository.validateUser(userId);

    const trade = this.createTradeEntity(tradeDto, user, tradeType);
    const savedTrade = await queryRunner.manager.save(Trade, trade);

    return savedTrade.tradeId;
  } catch (error) {
    this.logger.error(
      `미체결 생성 실패`,
      { error: error.stack, userId }
    );
    throw new TradeCreateFailedException(userId, error.message);
  }
}

private createTradeEntity(tradeDto: TradeDto, user: User, tradeType: string): Trade {
  const { typeGiven, typeReceived, receivedPrice, receivedAmount } = tradeDto;
  
  const trade = new Trade();
  trade.tradeType = tradeType;
  trade.tradeCurrency = typeGiven;
  trade.assetName = typeReceived;
  trade.price = receivedPrice;
  trade.quantity = receivedAmount;
  trade.user = user;

  return trade;
}

async updateTradeQuantity(tradeData: Partial<Trade>, queryRunner: QueryRunner): Promise<void> {
  try {
    await queryRunner.manager
      .createQueryBuilder()
      .update(Trade)
      .set({ quantity: tradeData.quantity })
      .where('tradeId = :tradeId', { tradeId: tradeData.tradeId })
      .execute();
  } catch (error) {
    this.logger.error(
      `미체결 수량 업데이트 실패`,
      { error: error.stack, tradeId: tradeData.tradeId }
    );
    throw new TradeUpdateFailedException(tradeData.tradeId, error.message);
  }
}

async deleteTrade(tradeId: number, queryRunner: QueryRunner): Promise<void> {
  try {
    const trade = await this.findTradeWithLock(tradeId, queryRunner);
    if (!trade) {
      throw new TradeNotFoundException(tradeId);
    }
    await queryRunner.manager.delete(Trade, tradeId);
  } catch (error) {
    this.logger.error(`미체결 삭제 실패`, { error: error.stack, tradeId });
    throw error;
  }
}

async findTradeWithLock(tradeId: number, queryRunner: QueryRunner): Promise<Trade> {
  try {
    const trade = await queryRunner.manager.findOne(Trade, {
      where: { tradeId },
      lock: { 
        mode: 'pessimistic_write',
        onLocked: 'nowait'
      }
    });

    if (!trade) {
      throw new TradeNotFoundException(tradeId);
    }

    return trade;
  } catch (error) {
    if (error instanceof TradeNotFoundException) {
      throw error;
    }
    
    this.logger.error(
      `트랜잭션 락으로 인해 미체결 내역을 찾을 수 없습니다.`,
      { error: error.stack, tradeId }
    );
    throw new TradeLockFailedException(tradeId);
  }
}

 async searchTrades(coinPrices: CoinPriceDto[], tradeType: string): Promise<Trade[]> {
   try {
     const queryBuilder = this.createQueryBuilder('trade')
       .leftJoinAndSelect('trade.user', 'user');

     this.buildTradeSearchQuery(queryBuilder, coinPrices, tradeType);
     
     return await queryBuilder.getMany();
   } catch (error) {
     this.logger.error(`미체결 내역 찾기 실패: ${error.message}`, error.stack);
     throw error;
   }
 }

 async searchBuyTrades(coinPrices: CoinPriceDto[]): Promise<Trade[]> {
   return this.searchTrades(coinPrices, TRADE_TYPES.BUY);
 }

 async searchSellTrades(coinPrices: CoinPriceDto[]): Promise<Trade[]> {
   return this.searchTrades(coinPrices, TRADE_TYPES.SELL);
 }

 private buildTradeSearchQuery(queryBuilder: SelectQueryBuilder<Trade>, coinPrices: CoinPriceDto[], tradeType: string) {
   const operator = tradeType === TRADE_TYPES.BUY ? '>=' : '<=';

   coinPrices.forEach(({ give, receive, price }, index) => {
     const params = {
       [`give${index}`]: give,
       [`receive${index}`]: receive,
       [`price${index}`]: price,
       [`type${index}`]: tradeType,
     };

     const condition = `trade.tradeCurrency = :give${index} AND 
                       trade.assetName = :receive${index} AND 
                       trade.price ${operator} :price${index} AND 
                       trade.tradeType = :type${index}`;

     if (index === 0) {
       queryBuilder.where(condition, params);
     } else {
       queryBuilder.orWhere(condition, params);
     }
   });
 }
}
