import { IsDateString, IsNumber, IsString } from "class-validator";

export class CandleDto{
    @IsString()
    market: string; // 종목 코드
  
    @IsDateString()
    candle_date_time_utc: string; // 캔들 기준 시각(UTC 기준)
  
    @IsDateString()
    candle_date_time_kst: string; // 캔들 기준 시각(KST 기준)
  
    @IsNumber()
    opening_price: number; // 시가
  
    @IsNumber()
    high_price: number; // 고가
  
    @IsNumber()
    low_price: number; // 저가
  
    @IsNumber()
    trade_price: number; // 종가
  
    @IsNumber()
    timestamp: number; // 해당 캔들에서 마지막 틱이 저장된 시각
}