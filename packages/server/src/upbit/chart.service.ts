import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { HttpService } from '@nestjs/axios';
import { UPBIT_CANDLE_URL } from "common/upbit";
import { CandleDto } from "./dtos/candle.dto";
import { ChartRepository } from "./chart.repository";

@Injectable()
export class ChartService {
    private upbitApiQueue = [];
    constructor(
        private readonly httpService: HttpService,
        private chartRepository: ChartRepository
    ){}

    async upbitApiDoor(type,coin,to, minute){
        if(!to) {
            const now = new Date()
            now.setHours(now.getHours()+9)
            to = now.toISOString().slice(0, 19);
        }
        const key = await this.getAllKeys(coin,to,type);
        const dbcheck = await this.chartRepository.getChartDate(key);
        if(dbcheck.length === 200) {
            return {
                statusCode : 200,
                result : dbcheck
            }
        }
        const size = this.upbitApiQueue.length;
        if(size>1 || this.upbitApiQueue[size-26]-Date.now() > 1000){
            const result = await this.waitForTransactionOrder(key);
            if(result){
                return {
                    statusCode : 200,
                    result : result
                }
            }
        }
        try{
            const url = type === "minutes" ? 
                `${UPBIT_CANDLE_URL}${type}/${minute}?market=${coin}&count=200&to=${to}` : `${UPBIT_CANDLE_URL}${type}?market=${coin}&count=200&to=${to}`
            const response = await firstValueFrom(
                this.httpService.get(url),
            );
            const candle: CandleDto = response.data
            this.saveChartData(candle, type, minute)
            return {
                statusCode: 200,
                result : candle
            }
        }catch(error){
            console.error(error)
            return error
        }
    }
    async waitForTransactionOrder(key, maxRetries = 100) { // 10초 타임아웃
        return new Promise(async (resolve, reject) => {
            let retryCount = 0;
    
            const check = async () => {
                try {
                    // DB 체크
                    const dbcheck = await this.chartRepository.getChartDate(key);
                    if (dbcheck.length === 200) {
                        return resolve(dbcheck); // reject 대신 resolve 사용
                    }
    
                    // 큐 사이즈 체크
                    const queueSize = this.upbitApiQueue.length;
                    if (queueSize === 0) {
                        return resolve(false);
                    }
    
                    // API 호출 제한 체크
                    if (queueSize > 26 || 
                        (this.upbitApiQueue[queueSize - 26] && 
                         this.upbitApiQueue[queueSize - 26] - Date.now() > 1000)) {
                        return resolve(false);
                    }
    
                    // 재시도 횟수 체크
                    if (retryCount++ >= maxRetries) {
                        return reject(new Error('Timeout waiting for transaction order'));
                    }
    
                    // 재귀 호출
                    setTimeout(check, 100);
                } catch (error) {
                    reject(error);
                }
            };
    
            // 초기 체크 시작
            check();
        });
    }
    saveChartData(candles, type, minute){
        candles.forEach((candle)=>{
            const market = candle.market;
            const kst = candle.candle_date_time_kst
            const key = this.getRedisKey(market,kst,type)
            this.chartRepository.setChartData(key,JSON.stringify(candle))
        })
    }

    getRedisKey(market, kst, type){
        const formattedDateTime = kst.replace(/[-T]/g, ':');
        const parts = formattedDateTime.split(':'); 

        switch (type) {
            case 'years':
                return `${market}:${parts[0]}`; 
            case 'months':
                return `${market}:${parts[0]}:${parts[1]}`; 
            case 'days':
                return `${market}:${parts[0]}:${parts[1]}:${parts[2]}`; 
            case 'minutes':
                return `${market}:${parts[0]}:${parts[1]}:${parts[2]}:${parts[3]}:${parts[4]}`; 
            case 'seconds':
                return `${market}:${parts[0]}:${parts[1]}:${parts[2]}:${parts[3]}:${parts[4]}:${parts[5]}`;
            default:
                throw new Error(`Invalid type: ${type}`);
        }
    }
    
    formatNumber(num) {
        return String(num).padStart(2, '0');
    }

    // 날짜를 문자열로 변환하는 함수
    formatDate(date, type, market) {
        const year = date.getFullYear();
        const month = this.formatNumber(date.getMonth()+1);
        const day = this.formatNumber(date.getDate());
        const hours = this.formatNumber(date.getHours());
        const minutes = this.formatNumber(date.getMinutes());
        const seconds = this.formatNumber(date.getSeconds());

        const formats = {
        years: () => `${year}`,
        months: () => `${year}:${month}`,
        days: () => `${year}:${month}:${day}`,
        minutes: () => `${year}:${month}:${day}:${hours}:${minutes}`,
        seconds: () => `${year}:${month}:${day}:${hours}:${minutes}:${seconds}`
        };

        return `${market}:${formats[type]()}`;
    }

    // 날짜 감소 함수
    decrementDate(date, type) {
        const decrementFunctions = {
            years: () => date.setFullYear(date.getFullYear() - 1),
            months: () => date.setMonth(date.getMonth() - 1),
            days: () => date.setDate(date.getDate() - 1),
            minutes: () => date.setMinutes(date.getMinutes() - 1),
            seconds: () => date.setSeconds(date.getSeconds() - 1)
        };

        decrementFunctions[type]();
        return date;
    }

    // 메인 함수
    getAllKeys(coin, to, type, count = 200) {
        const result = [];
        const currentDate = new Date(to);
        currentDate.setHours(currentDate.getHours()+9);

        for (let i = 0; i < count; i++) {
            result.push(this.formatDate(currentDate, type, coin));
            this.decrementDate(currentDate, type);
        }
        return result;
    }
}