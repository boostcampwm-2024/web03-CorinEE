import { IsDate, IsNumber, IsString } from 'class-validator';

export class TradeDataDto {
  @IsString()
  img_url: string;

  @IsString()
  koreanName: string;

  @IsString()
  coin: string;

  @IsString()
  market: string;

  @IsString()
  tradeType: string;

  @IsString()
  tradeId: number;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;

  @IsDate()
  createdAt: Date;

  @IsNumber()
  userId: number;
}
