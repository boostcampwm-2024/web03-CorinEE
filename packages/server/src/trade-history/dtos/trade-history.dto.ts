import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate } from 'class-validator';
import { TradeHistory } from '../trade-history.entity';

export class CreateTradeHistoryDto {
    @ApiProperty({ 
      example: 'BTC', 
      description: '거래 자산명' 
    })
    @IsString()
    assetName: string;
  
    @ApiProperty({ 
      example: 'buy',
      description: '거래 유형 (buy/sell)' 
    })
    @IsString()
    tradeType: string;
  
    @ApiProperty({ 
      example: 'KRW',
      description: '거래 통화' 
    })
    @IsString()
    tradeCurrency: string;
  
    @ApiProperty({ 
      example: 50000000,
      description: '거래 가격' 
    })
    @IsNumber()
    price: number;
  
    @ApiProperty({ 
      example: 0.5,
      description: '거래 수량' 
    })
    @IsNumber()
    quantity: number;
  
    @ApiProperty({ 
      example: '2024-03-27T09:00:00Z',
      description: '거래 생성 시간' 
    })
    @IsDate()
    createdAt: Date;
  }
  
  export class TradeHistoryResponseDto {
    @ApiProperty({ example: 200 })
    statusCode: number;
  
    @ApiProperty({ example: '거래 내역을 찾았습니다.' })
    message: string;
  
    @ApiProperty({ type: [TradeHistory] })
    result: TradeHistory[];
  }