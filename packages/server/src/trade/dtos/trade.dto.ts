import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class TradeDto {
  @ApiProperty({
    description: '건네주는 통화 타입',
    example: 'KRW',
  })
  @IsString()
  typeGiven: string;

  @ApiProperty({
    description: '건네받을 통화 타입',
    example: 'ETH',
  })
  @IsString()
  typeReceived: string;

  @ApiProperty({
    description: '건네받을 통화 가격',
    example: 5000000,
  })
  @IsNumber()
  @IsPositive()
  receivedPrice: number;

  @ApiProperty({
    description: '건네받을 통화 갯수',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  receivedAmount: number;
}

export class TradeAskDto {
  @ApiProperty({
    description: '건네주는 통화 타입',
    example: 'ETH',
  })
  @IsString()
  typeGiven: string;

  @ApiProperty({
    description: '건네받을 통화 타입',
    example: 'KRW',
  })
  @IsString()
  typeReceived: string;

  @ApiProperty({
    description: '건네받을 통화 가격',
    example: 100000,
  })
  @IsNumber()
  @IsPositive()
  receivedPrice: number;

  @ApiProperty({
    description: '건네받을 통화 갯수',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  receivedAmount: number;
}
