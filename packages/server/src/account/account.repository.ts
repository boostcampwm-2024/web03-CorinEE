import { DataSource, Repository, QueryRunner } from 'typeorm';
import {
	Injectable,
	UnprocessableEntityException,
	Logger,
} from '@nestjs/common';
import { Account } from './account.entity';
import { User } from '@src/auth/user.entity';
import { CURRENCY_CONSTANTS } from './constants/currency.constants';
import { UserDto } from './dtos/my-account.response.dto';
import { formatQuantity } from '@src/trade/helpers/trade.helper';

@Injectable()
export class AccountRepository extends Repository<Account> {
	private readonly logger = new Logger(AccountRepository.name);

	constructor(private readonly dataSource: DataSource) {
		super(Account, dataSource.createEntityManager());
	}

	async createAccountForAdmin(adminUser: User): Promise<void> {
		this.logger.log(`관리자 계정 생성 시작: ${adminUser.id}`);
		try {
			const account = new Account();
			account.KRW = CURRENCY_CONSTANTS.ADMIN_INITIAL_KRW;
			account.USDT = CURRENCY_CONSTANTS.ADMIN_INITIAL_USDT;
			account.BTC = CURRENCY_CONSTANTS.ADMIN_INITIAL_BTC;
			account.user = adminUser;

			await this.save(account);
			this.logger.log(`관리자 계정 생성 완료: ${adminUser.id}`);
		} catch (error) {
			this.logger.error(`관리자 계정 생성 실패: ${error.message}`, error.stack);
			throw error;
		}
	}

	async getMyMoney(user: UserDto, moneyType: string): Promise<number> {
		try {
			const account = await this.findOne({
				where: { user: { id: user.userId } },
			});

			return account?.[moneyType] || 0;
		} catch (error) {
			this.logger.error(`잔액 조회 실패: ${error.message}`, error.stack);
			throw error;
		}
	}

	async updateAccountCurrency(
		typeGiven: string,
		change: number,
		accountId: number,
		queryRunner: QueryRunner,
	): Promise<void> {
		this.logger.log(
			`계정 통화 업데이트 시작: accountId=${accountId}, type=${typeGiven}`,
		);
		try {
			await queryRunner.manager
				.createQueryBuilder()
				.update(Account)
				.set({
					// 직접 연산 처리: ()로 감싸 동적 SQL 계산
					[typeGiven]: () => `${typeGiven} + :change`,
				})
				.where('id = :id', { id: accountId })
				.setParameters({ change: formatQuantity(change) })
				.execute();
			this.logger.log(`계정 통화 업데이트 완료: accountId=${accountId}`);
		} catch (error) {
			this.logger.error(
				`계정 통화 업데이트 실패: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}
	async updateAccountAvailableCurrency(
		change: number,
		accountId: number,
		queryRunner: QueryRunner,
	): Promise<void> {
		this.logger.log(
			`계정 통화 업데이트 시작: accountId=${accountId}, type=availableKRW`,
		);
		try {
			await queryRunner.manager
				.createQueryBuilder()
				.update(Account)
				.set({ availableKRW: () => `availableKRW + ${change}` })
				.where('id = :id', { id: accountId })
				.execute();

			this.logger.log(`계정 통화 업데이트 완료: accountId=${accountId}`);
		} catch (error) {
			this.logger.error(
				`계정 통화 업데이트 실패: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}

	async updateAvailableKRW(
		accountId: number,
		updatedAvailableKRW: number,
		queryRunner: QueryRunner,
	): Promise<void> {
		await queryRunner.manager
			.createQueryBuilder()
			.update(Account)
			.set({ availableKRW: updatedAvailableKRW })
			.where('id = :id', { id: accountId })
			.execute();
	}

	async getAvailableKRW(
		accountId: number,
		queryRunner: QueryRunner,
	): Promise<number> {
		const account = await queryRunner.manager
			.createQueryBuilder(Account, 'account')
			.select('account.availableKRW')
			.where('account.id = :id', { id: accountId })
			.getOne();

		if (!account) {
			throw new Error(`Account with id ${accountId} not found`);
		}

		return account.availableKRW;
	}

	async updateAccountBTC(
		id: number,
		quantity: number,
		queryRunner: QueryRunner,
	): Promise<void> {
		this.logger.log(`BTC 잔액 업데이트 시작: accountId=${id}`);
		try {
			await queryRunner.manager
				.createQueryBuilder()
				.update(Account)
				.set({ BTC: quantity })
				.where('id = :id', { id })
				.execute();

			this.logger.log(`BTC 잔액 업데이트 완료: accountId=${id}`);
		} catch (error) {
			this.logger.error(
				`BTC 잔액 업데이트 실패: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}

	async validateUserAccount(userId: number): Promise<Account> {
		this.logger.log(`사용자 계정 검증 시작: userId=${userId}`);
		const userAccount = await this.findOne({
			where: { user: { id: userId } },
		});

		if (!userAccount) {
			this.logger.warn(`존재하지 않는 사용자 계정: userId=${userId}`);
			throw new UnprocessableEntityException('유저가 존재하지 않습니다.');
		}

		return userAccount;
	}

	async getAccount(id: number, queryRunner: QueryRunner): Promise<Account> {
		this.logger.log(`계정 조회 시작: userId=${id}`);
		try {
			const account = await queryRunner.manager.findOne(Account, {
				where: { user: { id } },
			});

			this.logger.log(`계정 조회 완료: userId=${id}`);
			return account;
		} catch (error) {
			this.logger.error(`계정 조회 실패: ${error.message}`, error.stack);
			throw error;
		}
	}
}
