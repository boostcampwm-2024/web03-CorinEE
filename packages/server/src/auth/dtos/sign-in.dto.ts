import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    example: 'admin',
    description: 'Email address of the user',
    required: true,
  })
  @IsString()
  username: string;
}
