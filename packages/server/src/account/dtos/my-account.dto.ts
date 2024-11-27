import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CoinDto {
  @IsString()
  img_url: string;

  @IsString()
  koreanName: string;

  @IsString()
  market: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsNumber()
  averagePrice: number;
}

export class MyAccountDto {
  @IsNumber()
  KRW: number;

  @IsNumber()
  total_bid: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CoinDto)
  coins: CoinDto[];
}
