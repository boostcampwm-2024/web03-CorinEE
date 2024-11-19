import {
	Injectable,
	InternalServerErrorException,
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
export class BidService implements OnModuleInit {
	private transactionBuy: boolean = false;
	private transactionCreateBid: boolean = false;
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
	async createBidTrade(user, bidDto) {
		if (this.transactionCreateBid) await this.waitForTransactionOrderBid();
		this.transactionCreateBid = true;
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
					statusCode: 422,
				});
			}
			const accountBalance = await this.checkCurrency(user, bidDto);
			await this.accountRepository.updateAccountCurrency(
				bidDto.typeGiven,
				accountBalance,
				userAccount.id,
				queryRunner,
			);
			await this.tradeRepository.createTrade(bidDto, user.userId, 'buy', queryRunner);
			await queryRunner.commitTransaction();
			return {
				statusCode: 200,
				message: '거래가 정상적으로 등록되었습니다.',
			};
		} catch (error) {
			console.log(error);
			await queryRunner.rollbackTransaction();
			if (error instanceof UnprocessableEntityException) throw error;
			return new InternalServerErrorException({
				statusCode: 500,
				message: '거래 등록에 실패했습니다.',
			});
		} finally {
			await queryRunner.release();
			this.transactionCreateBid = false;
		}
	}
	async checkCurrency(user, bidDto) {
		const { typeGiven, receivedPrice, receivedAmount } = bidDto;
		const givenAmount = receivedPrice * receivedAmount;
		const userAccount = await this.accountRepository.findOne({
			where: {
				user: { id: user.userId },
			},
		});
		const accountBalance = userAccount[typeGiven];
		const accountResult = accountBalance - givenAmount;
		
		if (accountResult < 0){
			throw new UnprocessableEntityException({
				message: '자산이 부족합니다.',
				statusCode: 422,
			});
		}
		return accountResult;
	}
	async bidTradeService(bidDto) {
		if (this.transactionBuy) await this.waitForTransactionOrder();
		this.transactionBuy = true;
		const {
			tradeId,
			typeGiven,
			receivedPrice,
			userId,
		} = bidDto;
		try {
			const currentCoinOrderbook =
				this.coinDataUpdaterService.getCoinOrderbookByBid(bidDto);
			for(const order of currentCoinOrderbook){
				if (order.ask_price > receivedPrice) break;
				const account = await this.accountRepository.findOne({
					where: {
						user: { id: userId },
					},
				});
				bidDto.accountBalance = account[typeGiven];
				bidDto.account = account;
				const tradeData = await this.tradeRepository.findOne({
					where: { tradeId: tradeId },
				});
				if(!tradeData) break;
				const result = await this.executeTrade(bidDto, order,tradeData)
				if(!result) break;
			}

			return {
				statusCode: 200,
				message: '거래가 정상적으로 등록되었습니다.',
			};
		} catch (error) {
			throw error;
		} finally {
			this.transactionBuy = false;
		}
	}
	async executeTrade(bidDto, order, tradeData) {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction('READ COMMITTED');
		const { ask_price, ask_size } = order;
		const {
			userId,
			account,
			typeGiven,
			typeReceived,
			tradeId,
			krw
		} = bidDto;
		let result = false;
		try {
			const buyData = {...tradeData};
			
			buyData.quantity = buyData.quantity >= ask_size ? ask_size : buyData.quantity;
			buyData.price = ask_price * krw;

			await this.tradeHistoryRepository.createTradeHistory(
				userId,
				buyData,
				queryRunner,
			);

			const asset = await this.assetRepository.findOne({
				where: { account: {id: account.id}, assetName: typeReceived },
			});
			console.log("asset : "+asset)
			if (asset) {
				asset.price =
					asset.price + buyData.price * buyData.quantity;
				asset.quantity += buyData.quantity;

				await this.assetRepository.updateAssetQuantityPrice(asset, queryRunner);
			} else {
				await this.assetRepository.createAsset(
					bidDto,
					buyData.price * buyData.quantity,
					buyData.quantity,
					queryRunner,
				);
			}
			
			tradeData.quantity -= buyData.quantity;
			
			if (tradeData.quantity === 0) {
				await this.tradeRepository.deleteTrade(tradeId, queryRunner);
			} else await this.tradeRepository.updateTradeTransaction(tradeData, queryRunner);

			const change = (tradeData.price - buyData.price) * buyData.quantity;
			const returnChange = change + account[typeGiven]
			const new_asset = await this.assetRepository.findOne({
				where: {account:{id:account.id}, assetName: "BTC"}
			})

			if(typeReceived === "BTC"){
				const BTC_QUANTITY = new_asset ? asset.quantity : buyData.quantity;
				await this.accountRepository.updateAccountBTC(account.id, BTC_QUANTITY, queryRunner)
			}

			await this.accountRepository.updateAccountCurrency(typeGiven,returnChange, account.id, queryRunner);

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
				if (!this.transactionBuy) resolve();
				else setTimeout(check, 100);
			};
			check();
		});
	}
	async waitForTransactionOrderBid() {
		return new Promise<void>((resolve) => {
			const check = () => {
				if (!this.transactionCreateBid) resolve();
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
			const availableTrades = await this.tradeRepository.searchBuyTrade(coinPrice);
			availableTrades.forEach((trade) => {
				const krw = coinLatestInfo.get(["KRW",trade.assetName].join("-")).trade_price
				const another = coinLatestInfo.get([trade.tradeCurrency,trade.assetName].join("-")).trade_price
				const bidDto = {
					userId: trade.user.id,
					typeGiven: trade.tradeCurrency, //건네주는 통화
					typeReceived: trade.assetName, //건네받을 통화 타입
					receivedPrice: trade.price, //건네받을 통화 가격
					receivedAmount: trade.quantity, //건네 받을 통화 갯수
					tradeId: trade.tradeId,
					krw: another/krw
				};
				this.bidTradeService(bidDto);
			});
		} catch (error) {
			console.error('미체결 거래 처리 오류:', error);
		} finally {
			console.log(`미체결 거래 처리 완료: ${Date()}`);
			setTimeout(
				() => this.matchPendingTrades(),
				UPBIT_UPDATED_COIN_INFO_TIME,
			);
		}
	}
}
