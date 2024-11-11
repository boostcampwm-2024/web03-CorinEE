import { IsString, IsNumber } from 'class-validator';

export class CoinTickerDto {
  @IsString()
  name: string;
  
	@IsString()
	code: string;

  @IsString()
  coin_img_url: string;

  @IsString()
  signed_change_price: number;

	@IsNumber()
	opening_price: number;

  @IsNumber()
  signed_change_rate: number;
  
	@IsNumber()
	trade_price: number;
}