import { ApiProperty } from '@nestjs/swagger';

export class TotalAssetResponseDto {
  @ApiProperty({
    description: '총 자산 데이터',
    type: Array,
  })
  totalAsset: any[];
}
