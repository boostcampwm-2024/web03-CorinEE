import {
	Injectable,
	OnModuleInit,
	UnprocessableEntityException,
} from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { AccountRepository } from 'src/account/account.repository';
import { AssetRepository } from 'src/asset/asset.repository';
import { TradeRepository } from './trade.repository';
import { CoinDataUpdaterService } from 'src/upbit/coin-data-updater.service';
import { TradeHistoryRepository } from '../trade-history/trade-history.repository';
import { UPBIT_UPDATED_COIN_INFO_TIME } from 'common/upbit';

@Injectable()
export class AskService implements OnModuleInit {
	private transactionAsk: boolean = false;
	private transactionCreateAsk: boolean = false;
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
		const asset = await this.assetRepository.findOne({
			where:{
				account: {id: user.userId},
				assetName: moneyType
			}
		})
		if(!asset) return 0;
		return Number(asset.quantity) * (percent / 100);
	}
	async createAskTrade(user, askDto) {
		if (this.transactionCreateAsk) await this.waitForTransactionCreate();
		this.transactionCreateAsk = true;
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction('READ COMMITTED');
		try {
			const userAccount = await this.accountRepository.findOne({
				where: {
					user: { id: user.userId },
				},
			});
			if (!userAccount) {
				throw new UnprocessableEntityException({
					message: '유저가 존재하지 않습니다.',
					code: 422,
				});
			}
			const userAsset = await this.checkCurrency(user, askDto, queryRunner);
			userAsset.quantity -= askDto.receivedAmount
			if(userAsset.quantity !==0){
				await this.assetRepository.updateAssetQuantity(
					userAsset,
					queryRunner,
				)
			}else {
				await this.assetRepository.delete({
					assetId: userAsset.assetId
				})
			}
			await this.tradeRepository.createTrade(askDto, user.userId,'sell', queryRunner);
			await queryRunner.commitTransaction();
			const temp = await this.assetRepository.findOne({
				where: {assetId: userAsset.assetId}
			})
			console.log(temp.quantity)
			return {
				code: 200,
				message: '거래가 정상적으로 등록되었습니다.',
			};
		} catch (error) {
			console.log(error);
			await queryRunner.rollbackTransaction();
			if (error instanceof UnprocessableEntityException) throw error;
			return new UnprocessableEntityException({
				code: 422,
				message: '거래 등록에 실패했습니다.',
			});
		} finally {
			await queryRunner.release();
			this.transactionCreateAsk = false;
		}
	}
	async checkCurrency(user, askDto,queryRunner) {
		const { typeGiven, receivedAmount } = askDto;
		const userAsset = await this.assetRepository.getAsset(user.userId, typeGiven,queryRunner)
		if(!userAsset){
			throw new UnprocessableEntityException({
				message: '자산이 부족합니다.',
				statusCode: 422,
			});
		}
		const accountBalance = userAsset.quantity;
		const accountResult = accountBalance - receivedAmount;
		if (accountResult < 0)
			throw new UnprocessableEntityException({
				message: '자산이 부족합니다.',
				statusCode: 422,
		});
		return userAsset;
	}
	async askTradeService(askDto) {
		if (this.transactionAsk) await this.waitForTransactionOrder();
		this.transactionAsk = true;
		const {
			tradeId,
			typeGiven,
			receivedPrice,
			userId,
		} = askDto;
		try {
			const userAsset = await this.assetRepository.findOne({
				where: {
					account: { id: userId },
					assetName: typeGiven
				},
			});
			askDto.assetBalance = userAsset.quantity;
			askDto.asset = userAsset;
			const currentCoinOrderbook =
				this.coinDataUpdaterService.getCoinOrderbookByAsk(askDto);
			for (const order of currentCoinOrderbook) {
				if (order.bid_price < receivedPrice) break;
				const tradeData = await this.tradeRepository.findOne({
					where: { tradeId: tradeId },
				});
				if (!tradeData) break;
				const result = await this.executeTrade(askDto, order, tradeData);
				if (!result) break;
			}

			return {
				code: 200,
				message: '거래가 정상적으로 등록되었습니다.',
			};
		} catch (error) {
			throw error;
		} finally {
			this.transactionAsk = false;
		}
	}
	async executeTrade(askDto, order, tradeData) {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction('READ COMMITTED');
		const { bid_price, bid_size } = order;
		const {
			userId,
			tradeId,
			asset,
			assetBalance,
			krw
		} = askDto;
		let result = false;
		try {
			const buyData = { ...tradeData };
			buyData.quantity =
				tradeData.quantity >= bid_size ? bid_size : tradeData.quantity;
			buyData.price = bid_price;
			await this.tradeHistoryRepository.createTradeHistory(
				userId,
				buyData,
				queryRunner,
			);

			if (assetBalance !== 0) {
				asset.price =
					asset.price * asset.quantity - krw * buyData.quantity;
				await this.assetRepository.updateAssetPrice(asset, queryRunner);

			}

			tradeData.quantity -= buyData.quantity;

			if (tradeData.quantity === 0) {
				await this.tradeRepository.deleteTrade(tradeId, queryRunner);
			} else
				await this.tradeRepository.updateTradeTransaction(
					tradeData,
					queryRunner,
				);

			await queryRunner.commitTransaction();
			result = true;
		} catch (error) {
			await queryRunner.rollbackTransaction();
			console.log(error);
		} finally {
			await queryRunner.release();
			return result;
		}
	}

	async waitForTransactionOrder() {
		return new Promise<void>((resolve) => {
			const check = () => {
				if (!this.transactionAsk) resolve();
				else setTimeout(check, 100);
			};
			check();
		});
	}
    async waitForTransactionCreate() {
		return new Promise<void>((resolve) => {
			const check = () => {
				if (!this.transactionCreateAsk) resolve();
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
				coinPrice.push({ give: receive, receive: give, price: price });
			});
			const availableTrades = await this.tradeRepository.searchSellTrade(coinPrice);
			availableTrades.forEach((trade) => {
				const askDto = {
					userId: trade.user.id,
					typeGiven: trade.tradeCurrency, //건네주는 통화
					typeReceived: trade.assetName, //건네받을 통화 타입
					receivedPrice: trade.price, //건네받을 통화 가격
					receivedAmount: trade.quantity, //건네 받을 통화 갯수
					tradeId: trade.tradeId,
					krw: coinLatestInfo.get(["KRW",trade.assetName].join("-")),
				};
				this.askTradeService(askDto);
			});
		} catch (error) {
			console.error('미체결 거래 처리 오류:', error);
		} finally {
			console.log(`미체결 거래 처리 완료: ${Date()}`);
			setTimeout(() => this.matchPendingTrades(), UPBIT_UPDATED_COIN_INFO_TIME);
		}
	}
}
