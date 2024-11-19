import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CoinDto {
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
  @ValidateNested({ each: true }) // 배열의 각 요소를 검증
  @Type(() => CoinDto) // 배열 요소의 타입 지정
  coins: CoinDto[];
}
