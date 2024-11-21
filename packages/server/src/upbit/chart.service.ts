import { BadRequestException, Injectable, OnModuleInit } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { HttpService } from '@nestjs/axios';
import { ONE_SECOND, UPBIT_CANDLE_URL, UPBIT_REQUEST_SIZE } from "common/upbit";
import { CandleDto } from "./dtos/candle.dto";
import { ChartRepository } from "./chart.repository";

@Injectable()
export class ChartService implements OnModuleInit{
    private upbitApiQueue;
    
    constructor(
        private readonly httpService: HttpService,
        private chartRepository: ChartRepository
    ){}
    onModuleInit() {
        this.upbitApiQueue = [];
        this.cleanQueue()
    }
    async upbitApiDoor(type,coin,to, minute){
        const validMinutes = ["1", "3", "5", "10", "15", "30", "60", "240"];
        if (type === 'minutes') {
            if (!minute || !validMinutes.includes(minute)) {
                throw new BadRequestException();
            }
        }
        if(!to) {
            const now = new Date()
            now.setHours(now.getHours()+9)
            to = now.toISOString().slice(0, 19);
        }
        const key = await this.getAllKeys(coin,to,type,minute);
        const dbcheck = await this.chartRepository.getChartDate(key);
        if(dbcheck.length === 200) {
            return {
                statusCode : 200,
                result : dbcheck
            }
        }

        const result = await this.waitForTransactionOrder(key);
        if(result){
            return {
                statusCode : 200,
                result : result
            }
        }
        try{
            this.upbitApiQueue.push(Date.now())
            console.log(this.upbitApiQueue.length)
            const url = type === "minutes" 
                ? `${UPBIT_CANDLE_URL}${type}/${minute}?market=${coin}&count=200&to=${to}` 
                : `${UPBIT_CANDLE_URL}${type}?market=${coin}&count=200&to=${to}`;
            const response = await firstValueFrom(
                this.httpService.get(url),
            );
            if(response.data.error) console.log(response)
            else{
                console.log(response.headers["remaining-req"])
            }
            const candle: CandleDto = response.data
            this.saveChartData(candle, type, minute)
            return {
                statusCode: 200,
                result : candle
            }
        }catch(error){
            console.error("updateApiDoor Error : "+error)
            return error
        }finally{
            console.log(this.upbitApiQueue.length)
        }
    }
    async waitForTransactionOrder(key, maxRetries = 100) { // 10초 타임아웃
        return new Promise(async (resolve, reject) => {
            let retryCount = 0;
            const check = async () => {
                try {
                    const dbcheck = await this.chartRepository.getChartDate(key);
                    if (dbcheck.length === 200) {
                        return resolve(dbcheck); // reject 대신 resolve 사용
                    }
                    const queueSize = this.upbitApiQueue.length;
                    if (queueSize < UPBIT_REQUEST_SIZE || this.upbitApiQueue[queueSize - 1] - Date.now() < -ONE_SECOND){
                        return resolve(false);
                    }
                    if (retryCount++ >= maxRetries) {
                        return reject(new Error('Timeout waiting for transaction order'));
                    }
                    setTimeout(check, 100);
                } catch (error) {
                    reject(error);
                }
            };
            check();
        });
    }
    async saveChartData(candles, type, minute) {
        try {
            const savePromises = candles.map(candle => {
                const key = this.getRedisKey(candle.market, candle.candle_date_time_kst, type, minute);
                return this.chartRepository.setChartData(key, JSON.stringify(candle));
            });
    
            await Promise.all(savePromises);
        } catch (error) {
            console.error('saveChartData Error :', error);
            throw error;
        }
    }
    
    getRedisKey(market, kst, type, minute = null) {
        const formattedDateTime = kst.replace(/[-T]/g, ':');
        const parts = formattedDateTime.split(':');
    
        const keyFormats = {
            years: () => `${market}:${parts[0]}`,
            months: () => `${market}:${parts[0]}:${parts[1]}`,
            days: () => `${market}:${parts[0]}:${parts[1]}:${parts[2]}`,
            weeks: () => `${market}:${parts[0]}:${parts[1]}:${parts[2]}:W`,
            minutes: () => {
                return `${market}:${parts[0]}:${parts[1]}:${parts[2]}:${parts[3]}:${parts[4]}:${minute}M`;
            },
            seconds: () => `${market}:${parts[0]}:${parts[1]}:${parts[2]}:${parts[3]}:${parts[4]}:${parts[5]}`
        };
    
        const formatFn = keyFormats[type];
        if (!formatFn) {
            throw new Error(`Invalid type: ${type}`);
        }
    
        return formatFn();
    }
    
    formatNumber(num) {
        return String(num).padStart(2, '0');
    }
    
    formatDate(date, type, market, minute = null) {
        const year = date.getFullYear();
        const month = this.formatNumber(date.getMonth() + 1);
        const day = this.formatNumber(date.getDate());
        const hours = this.formatNumber(date.getHours());
        const minutes = this.formatNumber(date.getMinutes());
        const seconds = this.formatNumber(date.getSeconds());
    
        const formats = {
            years: () => `${year}`,
            months: () => `${year}:${month}`,
            days: () => `${year}:${month}:${day}`,
            weeks: () => `${year}:${month}:${day}:W`,
            minutes: () => {
                return `${year}:${month}:${day}:${hours}:${minutes}:${minute}M`;
            },
            seconds: () => `${year}:${month}:${day}:${hours}:${minutes}:${seconds}`
        };
    
        if (!formats[type]) {
            throw new Error(`Invalid type: ${type}`);
        }
    
        return `${market}:${formats[type]()}`;
    }
    
    decrementDate(date, type) {
        const decrementFunctions = {
            years: () => date.setFullYear(date.getFullYear() - 1),
            months: () => date.setMonth(date.getMonth() - 1),
            weeks: () => date.setDate(date.getDate() - 7),
            days: () => date.setDate(date.getDate() - 1),
            minutes: () => date.setMinutes(date.getMinutes() - 1),
            seconds: () => date.setSeconds(date.getSeconds() - 1)
        };
    
        if (!decrementFunctions[type]) {
            throw new Error(`Invalid type: ${type}`);
        }
    
        decrementFunctions[type]();
        return date;
    }
    
    getAllKeys(coin, to, type, minute = null, count = 200) {
        const result = [];
        const currentDate = new Date(to);
        currentDate.setHours(currentDate.getHours() + 9);
    
        for (let i = 0; i < count; i++) {
            result.push(this.formatDate(currentDate, type, coin, minute));
            this.decrementDate(currentDate, type);
        }
        return result;
    }
    cleanQueue(){
        while(this.upbitApiQueue.length > 0 && this.upbitApiQueue[0] - Date.now() < -ONE_SECOND){
            this.upbitApiQueue.shift();
        }
        setTimeout(()=>this.cleanQueue(),100)
    }
    makeCandle(coinData){
        const name = coinData.code;
        // date와 time을 각각 파싱
        const year = coinData.trade_date.slice(0, 4);
        const month = coinData.trade_date.slice(4, 6);
        const day = coinData.trade_date.slice(6, 8);

        const hour = coinData.trade_time.slice(0, 2);
        const minute = coinData.trade_time.slice(2, 4);
        const second = coinData.trade_time.slice(4, 6);

        const tradeDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
        const kstDate = new Date(tradeDate.getTime() + 9 * 60 * 60 * 1000 * 2);

        const price = coinData.trade_price;
        const timestamp = coinData.trade_timestamp;
        const candle_acc_trade_volume = coinData.trade_volume
        const candle_acc_trade_price = price * candle_acc_trade_volume;
        const candle = {
            market : name,
            candle_date_time_kst : kstDate.toISOString().slice(0,19),
            opening_price : price,
            high_price : price,
            low_price : price,
            trade_price : price,
            timestamp : timestamp,
            candle_acc_trade_price : candle_acc_trade_price,
            candle_acc_trade_volume : candle_acc_trade_volume
        }
        const type = ['years','months','weeks','days','minutes','seconds'];
        const minute_type = ["1", "3", "5", "10", "15", "30", "60", "240"];
        type.forEach(async (key)=>{
            if(key === 'minutes'){
                const keys = [];
                minute_type.forEach((min)=>{
                    keys.push(this.formatDate(kstDate, key, name, min));
                })
                keys.forEach(async (min)=>{
                    const candleData = await this.chartRepository.getSimpleChartData(min);
                    if(!candleData){
                        this.chartRepository.setChartData(min,JSON.stringify(candle))
                    }else{
                        candleData.trade_price = price;
                        candleData.high_price = candleData.high_price < price ? price : candleData.high_price;
                        candleData.low_price = candleData.low_price > price ? price : candleData.low_price;
                        candleData.timestamp = timestamp;
                        candleData.candle_acc_trade_price = candle_acc_trade_price;
                        candleData.candle_acc_trade_volume += candle_acc_trade_volume;
                        
                        this.chartRepository.setChartData(min,JSON.stringify(candleData))
                    }
                })
            }else{
                const redisKey = this.formatDate(kstDate, key, name, null);
                const candleData = await this.chartRepository.getSimpleChartData(redisKey);
                if(!candleData){
                    this.chartRepository.setChartData(redisKey,JSON.stringify(candle))
                }else{
                    candleData.trade_price = price;
                    candleData.high_price = candleData.high_price < price ? price : candleData.high_price;
                    candleData.low_price = candleData.low_price > price ? price : candleData.low_price;
                    candleData.timestamp = timestamp;
                    candleData.candle_acc_trade_price = candle_acc_trade_price;
                    candleData.candle_acc_trade_volume += candle_acc_trade_volume;
                    
                    this.chartRepository.setChartData(redisKey,JSON.stringify(candleData))
                }
            }
        })
    }
}