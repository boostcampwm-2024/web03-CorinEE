import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    example: 'newuser',
    description: 'Username for the new user',
    required: true,
  })
  @IsString()
  username: string;
}
