import { IsDate, IsNumber, IsString } from "class-validator";

export class TradeHistoryDataDto {
    @IsString()
    img_url: string;
  
    @IsString()
    koreanName: string;
  
    @IsString()
    coin: string;
  
    @IsString()
    tradeType: string;
  
    @IsString()
    market: string;

    @IsNumber()
    price: number;
  
    @IsNumber()
    averagePrice: number;

    @IsNumber()
    quantity: number;

    @IsDate()
    createdAt: Date;

    @IsDate()
    tradeDate: Date;

    @IsNumber()
    userId: number;
  }