import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';
import { Favorite } from '../favorite.entity';

export class FavoriteDto {
  @ApiProperty({
    example: 1,
    description: '즐겨찾기 ID',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: 'BTC',
    description: '자산 이름',
  })
  @IsString()
  assetName: string;

  @ApiProperty({
    example: 1,
    description: '사용자 ID',
  })
  @IsNumber()
  userId: number;
}

export class FavoriteResponseDto {
  @ApiProperty({
    example: 200,
    description: '상태 코드',
  })
  statusCode: number;

  @ApiProperty({
    type: [FavoriteDto],
    description: '즐겨찾기 목록',
  })
  result: FavoriteDto[] | Favorite[];
}
