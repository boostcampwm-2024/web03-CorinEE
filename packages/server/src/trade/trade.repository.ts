import { DataSource, Repository, QueryRunner } from 'typeorm';
import { Trade } from './trade.entity';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UserRepository } from 'src/auth/user.repository';

@Injectable()
export class TradeRepository extends Repository<Trade> {
  constructor(
    private dataSource: DataSource,
    private userRepository: UserRepository,
  ) {
    super(Trade, dataSource.createEntityManager());
  }
  async createTrade(buyDto: any, userId, queryRunner): Promise<number> {
    try {
      const { typeGiven, typeReceived, receivedPrice, receivedAmount } =
        buyDto;

      const user = await this.userRepository.getUser(userId);

      if (!user) {
        throw new UnprocessableEntityException({
          response: {
            message: '유저가 존재하지 않습니다.',
            statusCode: 422,
          },
        });
      }
      const trade = new Trade();
      trade.tradeType = 'buy';
      trade.tradeCurrency = typeGiven;
      trade.assetName = typeReceived;
      trade.price = receivedPrice;
      trade.quantity = receivedAmount;
      trade.user = user;

      const savedTrade = await queryRunner.manager.save(Trade, trade);

      return savedTrade.tradeId;
    } catch (e) {
      console.log(e);
    }
  }
  async updateTradeTransaction(tradeData, queryRunner){
    await queryRunner.manager.save(Trade, tradeData);
  }
  async deleteTrade(tradeId: number, queryRunner: QueryRunner): Promise<Trade> {
    try {
      const trade = await queryRunner.manager.findOne(Trade, {
        where: { tradeId },
      });

      await queryRunner.manager.delete(Trade, tradeId);

      return trade;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
  async searchTrade(coinPrice) {
    try {
      const queryBuilder = this.createQueryBuilder('trade').leftJoinAndSelect(
        'trade.user',
        'user',
      );
      coinPrice.forEach(({ give, receive, price }, index) => {
        const params = {
          [`give${index}`]: give,
          [`receive${index}`]: receive,
          [`price${index}`]: price,
          [`type${index}`]: 'buy',
        };
        if (index === 0) {
          queryBuilder.where(
            'trade.tradeCurrency = :give0 AND trade.assetName = :receive0 AND trade.price >= :price0 AND trade.tradeType = :type0',
            params,
          );
        } else {
          queryBuilder.orWhere(
            `trade.tradeCurrency = :give${index} AND trade.assetName = :receive${index} AND trade.price >= :price${index} AND trade.tradeType = :type${index}`,
            params,
          );
        }
      });
      const trades = await queryBuilder.getMany();
      return trades;
    } catch (e) {
      console.log(e);
    } 
  }
}