import {
	Injectable,
	OnModuleInit,
	UnprocessableEntityException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CoinDataUpdaterService } from 'src/upbit/coin-data-updater.service';
import { TradeHistoryRepository } from '../trade-history/trade-history.repository';
import { UPBIT_IMAGE_URL } from 'common/upbit';
import { TradeHistoryDataDto } from './dtos/tradehistoryData.dto';

@Injectable()
export class TradeHistoryService {

	constructor(
        private tradehistoryRepository: TradeHistoryRepository,
        private coinDataUpdaterService: CoinDataUpdaterService,
		private readonly dataSource: DataSource,
	) {}

    async getMyTradeHistoryData(user,coin){
        try{
            const result = [];
            let tradehistoryData = await this.tradehistoryRepository.find({
                where: {user : {id : user.userId}}
            })
            
            if(tradehistoryData.length === 0){
                return {
                    statusCode : 201,
                    message : "거래 내역이 없습니다.",
                    tradeData : []
                }
            }
            const coinNameData = await this.coinDataUpdaterService.getCoinNameList();

            if(coin){
                const [assetName, tradeCurrency] = coin.split("-")
                tradehistoryData = tradehistoryData.filter(({ assetName: a, tradeCurrency: t }) => (a === assetName && t === tradeCurrency) || (a === tradeCurrency && t === assetName));
            }
            tradehistoryData.forEach(tradehistory=>{
                const name = tradehistory.tradeType === 'buy' ? tradehistory.tradeCurrency : tradehistory.assetName;
                const tradeType = tradehistory.tradeType
                const tradedata: TradeHistoryDataDto = {
                    img_url : `${UPBIT_IMAGE_URL}${name}.png`,
                    koreanName : coinNameData.get(`${tradehistory.assetName}-${tradehistory.tradeCurrency}`) || coinNameData.get(`${tradehistory.tradeCurrency}-${tradehistory.assetName}`),
                    coin : tradeType === 'buy' ? tradehistory.assetName : tradehistory.tradeCurrency,
                    market : tradeType === 'sell' ? tradehistory.assetName : tradehistory.tradeCurrency,
                    tradeType : tradeType,
                    price : tradehistory.price,
                    averagePrice : tradehistory.quantity / tradehistory.price,
                    quantity : tradehistory.quantity,
                    createdAt : tradehistory.createdAt,
                    tradeDate : tradehistory.tradeDate,
                    userId : user.userId
                };

                result.push(tradedata)
            })
            return {
                statusCode : 200,
                message : "거래 내역을 찾았습니다.",
                tradeData: tradehistoryData
            }
        }catch(error){
            console.error(error)
            return error
        }
    }
}
