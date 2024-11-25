import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    example: 'newuser',
    description: 'Username for the new user',
    required: true,
  })
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsBoolean()
  isGuest: boolean;

  @IsString()
  provider: string;

  @IsString()
  providerId: string;
}
