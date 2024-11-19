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
export class TradeService {

	constructor(
		private accountRepository: AccountRepository,
		private assetRepository: AssetRepository,
		private readonly dataSource: DataSource,
	) {}
    async checkMyCoinData(user,coin){
        const account = await this.accountRepository.findOne({
            where: {user : {id : user.userId}}
        })
        if(!account) {
            return {
                statusCode :400,
                message: "등록되지 않은 사용자입니다."
            }
        }
        const coinData = await this.assetRepository.findOne({
            where: {
                account: {id : account.id},
                assetName: coin
            }
        })
        if(coinData){
            return {
                statusCode : 200,
                message: "보유하고 계신 코인입니다.",
                own : true
            }
        }else{
            return {
                statusCode : 201,
                message : "보유하지 않은 코인입니다.",
                own : false
            }
        }
    }
}
