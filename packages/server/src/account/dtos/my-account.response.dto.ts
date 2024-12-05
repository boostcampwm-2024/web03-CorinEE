import { ApiProperty } from '@nestjs/swagger';
import { CoinDto, MyAccountDto } from './my-account.dto';
import { IsNumber, IsString } from 'class-validator';

export class MyAccountResponseDto {
  @ApiProperty({
    example: 200,
    description: '응답 상태 코드',
  })
  statusCode: number;

  @ApiProperty({
    type: MyAccountDto,
    description: '계정 정보',
  })
  message: MyAccountDto;
}

export class AccountResponseDto {
    @ApiProperty({
      example: 2000000,
      description: '계좌 잔액',
    })
    KRW: number;

    @ApiProperty({
      example: 2000000,
      description: '매수가능한 계좌 잔액',
    })
    availableKRW: number;
  
    @ApiProperty({
      type: MyAccountDto,
      description: '총 매수 금액',
    })
    total_bid: number;

  @ApiProperty({
    type: MyAccountDto,
    description: '보유 코인',
  })
  coins: CoinDto[];
}

export class UserDto {
  @ApiProperty({
    example: 1,
    description: '사용자 고유 ID',
  })
  @IsNumber()
  readonly userId: number;

  @ApiProperty({
    example: 'john_doe',
    description: '사용자 이름',
  })
  @IsString()
  readonly userName: string;
}
