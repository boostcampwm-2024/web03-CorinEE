import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { TradeRepository } from '../trade/trade.repository';
import { TradeHistoryRepository } from '../trade-history/trade-history.repository';
import { AccountRepository } from '@src/account/account.repository';
import { DEFAULT_BTC, DEFAULT_KRW, DEFAULT_USDT } from './constants';
import { DataSource } from 'typeorm';
import { AccountService } from '@src/account/account.service';

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name);

	constructor(
		private readonly userRepository: UserRepository,
		private readonly tradeRepository: TradeRepository,
		private readonly accountRepository: AccountRepository,
		private readonly tradeHistoryRepository: TradeHistoryRepository,
		private readonly accountService: AccountService,

		private readonly dataSource: DataSource,
	) { }

	async resetUserData(userId: number): Promise<void> {
		await this.dataSource.transaction(async (manager) => {
			const user = await manager.findOne(this.userRepository.target, {
				where: { id: userId },
				relations: ['account'], // account 관계를 로드
			});

			if (!user) {
				throw new NotFoundException(`User with ID ${userId} not found`);
			}

			this.logger.log(`유저 데이터 삭제 시작: User ID ${userId}`);

			await manager.delete(this.tradeRepository.target, { user });

			await manager.delete(this.tradeHistoryRepository.target, { user });

			if (user.account) {
				await manager.delete(this.accountRepository.target, { id: user.account.id });
				user.account = null;
				await manager.save(this.userRepository.target, user);
			}
			await manager.save(this.userRepository.target, user);

			this.logger.log(`유저 데이터 삭제 완료: User ID ${userId}`);

			this.logger.log(`새 어카운트 생성 시작: User ID ${userId}`);

			const newAccount = manager.create(this.accountRepository.target, {
				KRW: DEFAULT_KRW,
				availableKRW: DEFAULT_KRW,
				USDT: DEFAULT_USDT,
				BTC: DEFAULT_BTC,
			});

			user.account = newAccount;

			await manager.save(this.userRepository.target, user);

			this.logger.log(`새 어카운트 생성 완료: User ID ${userId}`);
		});
	}

	 async getAllUsersInfo(): Promise<{ id: number; username: string }[]> {
    try {
      const users = await this.userRepository.find({
        select: ['id', 'username'],
      });

      return users.map(user => ({
        id: user.id,
        username: user.username,
      }));
    } catch (error) {
      this.logger.error('Failed to fetch all users', error.stack);
      throw error;
    }
  }

	async getAllUsersInfoWithTotalAsset(): Promise<any[]> {
    try {
      const users = await this.userRepository.find({
        select: ['id', 'username'], // id와 username만 선택
      });

      // 각 유저에 대해 총 자산 정보를 가져옴
      const usersInfoWithTotalAsset = [];
      for (const user of users) {
        const accountId = user.id;

        // 총 자산 계산 (accountService의 메서드를 사용)
        const totalAssetData = await this.accountService.getEvaluatedAssets(accountId);

        usersInfoWithTotalAsset.push({
          id: user.id,
          username: user.username,
          totalAsset: totalAssetData.totalAsset, // 총 자산 정보
          KRW: totalAssetData.KRW, // KRW 정보
          coinEvaluations: totalAssetData.coinEvaluations, // 코인 평가 정보
        });
      }

      return usersInfoWithTotalAsset;
    } catch (error) {
      this.logger.error('Failed to fetch all users with total asset', error.stack);
      throw error;
    }
  }
}
