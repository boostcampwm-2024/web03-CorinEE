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
import { UPBIT_IMAGE_URL, UPBIT_UPDATED_COIN_INFO_TIME } from 'common/upbit';
import { TradeDataDto } from './dtos/tradeData.dto'
@Injectable()
export class TradeService {

	constructor(
		private accountRepository: AccountRepository,
		private assetRepository: AssetRepository,
        private tradeRepository: TradeRepository,
        private coinDataUpdaterService: CoinDataUpdaterService,
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
    async getMyTradeData(user,coin){
        try{
            const result = [];
            let tradeData = await this.tradeRepository.find({
                where: {user : {id : user.userId}}
            })
            
            if(tradeData.length === 0){
                return {
                    statusCode : 201,
                    message : "미체결 데이터가 없습니다.",
                    result : []
                }
            }
            const coinNameData = this.coinDataUpdaterService.getCoinNameList();
            if(coin){
                const [assetName, tradeCurrency] = coin.split("-")
                tradeData = tradeData.filter(({ assetName: a, tradeCurrency: t }) => (a === assetName && t === tradeCurrency) || (a === tradeCurrency && t === assetName));
            }
            tradeData.forEach(trade=>{
                const name = trade.tradeType === 'buy' ? trade.tradeCurrency : trade.assetName;
                const tradeType = trade.tradeType
                const tradedata: TradeDataDto = {
                    img_url : `${UPBIT_IMAGE_URL}${name}.png`,
                    koreanName : coinNameData.get(`${trade.assetName}-${trade.tradeCurrency}`) || coinNameData.get(`${trade.tradeCurrency}-${trade.assetName}`),
                    coin : tradeType === 'buy' ? trade.assetName : trade.tradeCurrency,
                    market : tradeType === 'sell' ? trade.assetName : trade.tradeCurrency,
                    tradeId : trade.tradeId,
                    tradeType : tradeType,
                    price : trade.price,
                    quantity : trade.quantity,
                    createdAt : trade.createdAt,
                    userId : user.userId
                };

                result.push(tradedata)
            })
            return {
                statusCode : 200,
                message : "미체결 데이터가 있습니다.",
                result
            }
        }catch(error){
            console.error(error)
            return error
        }
    }
}
