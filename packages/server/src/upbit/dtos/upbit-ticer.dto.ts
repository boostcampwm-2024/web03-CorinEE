import { IsString, IsNumber } from 'class-validator';

export class UpbitTickerDto {
  @IsString()
  type: string;

  @IsString()
  code: string;

  @IsNumber()
  opening_price: number;

  @IsNumber()
  high_price: number;

  @IsNumber()
  low_price: number;

  @IsNumber()
  trade_price: number;
}
