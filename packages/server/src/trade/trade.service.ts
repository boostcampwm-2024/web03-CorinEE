import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AccountRepository } from 'src/account/account.repository';
import { AssetRepository } from 'src/asset/asset.repository';
import { TradeRepository } from './trade.repository';
import { CoinDataUpdaterService } from 'src/upbit/coin-data-updater.service';
import { UPBIT_IMAGE_URL } from '@src/upbit/constants';
import { TradeDataDto } from './dtos/tradeData.dto';
@Injectable()
export class TradeService {
	constructor(
		private accountRepository: AccountRepository,
		private assetRepository: AssetRepository,
		private tradeRepository: TradeRepository,
		private coinDataUpdaterService: CoinDataUpdaterService,
		private readonly dataSource: DataSource,
	) {}
	async checkMyCoinData(user, coin) {
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
		if (coinData) {
			return {
				statusCode: 200,
				message: '보유하고 계신 코인입니다.',
				own: true,
			};
		} else {
			return {
				statusCode: 201,
				message: '보유하지 않은 코인입니다.',
				own: false,
			};
		}
	}
	async getMyTradeData(user, coin) {
		try {
			const result = [];
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
				const [assetName, tradeCurrency] = coin.split('-');
				tradeData = tradeData.filter(
					({ assetName: a, tradeCurrency: t }) =>
						(a === assetName && t === tradeCurrency) ||
						(a === tradeCurrency && t === assetName),
				);
			}
			tradeData.forEach((trade) => {
				const name =
					trade.tradeType === 'buy' ? trade.tradeCurrency : trade.assetName;
				const tradeType = trade.tradeType;
				const tradedata: TradeDataDto = {
					img_url: `${UPBIT_IMAGE_URL}${name}.png`,
					koreanName:
						coinNameData.get(`${trade.assetName}-${trade.tradeCurrency}`) ||
						coinNameData.get(`${trade.tradeCurrency}-${trade.assetName}`),
					coin: tradeType === 'buy' ? trade.assetName : trade.tradeCurrency,
					market: tradeType === 'sell' ? trade.assetName : trade.tradeCurrency,
					tradeId: trade.tradeId,
					tradeType: tradeType,
					price: trade.price,
					quantity: trade.quantity,
					createdAt: trade.createdAt,
					userId: user.userId,
				};

				result.push(tradedata);
			});
			return {
				statusCode: 200,
				message: '미체결 데이터가 있습니다.',
				result,
			};
		} catch (error) {
			console.error(error);
			return error;
		}
	}

	async deleteMyBidTrade(user, tradeId) {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction('READ COMMITTED');

		try {
			const trade = await this.tradeRepository.getTradeFindOne(tradeId,queryRunner)
			if (!trade) {
				throw new UnprocessableEntityException({
					statusCode: 422,
					message: '해당 미체결 거래를 찾을 수 없습니다.',
				});
			}

			await this.tradeRepository.deleteTrade(tradeId, queryRunner);

			const userAccount = await this.accountRepository.findOne({
				where: { user: { id: user.userId } },
			});
			const accountBalance = parseFloat(
				(
					trade.price * trade.quantity +
					userAccount[trade.tradeCurrency]
				).toFixed(8),
			);
			await this.accountRepository.updateAccountCurrency(
				trade.tradeCurrency,
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
			throw new UnprocessableEntityException({
				statusCode: 422,
				message: '해당 미체결 거래를 찾을 수 없습니다.',
			});
		} finally {
			await queryRunner.release();
		}
	}
	async deleteMyAskTrade(user, tradeId) {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction('READ COMMITTED');

		try {
			// 미체결 거래를 검색
			const trade = await this.tradeRepository.findOne({
				where: {
					tradeId,
					user: { id: user.userId },
				},
			});
			if (!trade) {
				throw new UnprocessableEntityException({
					statusCode: 422,
					message: '해당 미체결 거래를 찾을 수 없습니다.',
				});
			}

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

			userAsset.availableQuantity = parseFloat(
				(userAsset.availableQuantity + trade.quantity).toFixed(8),
			);

			this.assetRepository.updateAssetAvailableQuantity(userAsset, queryRunner);

			await queryRunner.commitTransaction();

			return {
				statusCode: 200,
				message: '거래가 성공적으로 취소되었습니다.',
			};
		} catch (error) {
			console.log(error);
			await queryRunner.rollbackTransaction();
			throw new UnprocessableEntityException({
				statusCode: 422,
				message: '해당 미체결 거래를 찾을 수 없습니다.',
			});
		} finally {
			await queryRunner.release();
		}
	}
}
