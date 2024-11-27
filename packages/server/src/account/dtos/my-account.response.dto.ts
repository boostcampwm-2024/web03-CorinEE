import { ApiProperty } from '@nestjs/swagger';
import { MyAccountDto } from './my-account.dto';
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
