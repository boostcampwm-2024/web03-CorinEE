  import {
      Body,
      Controller,
      Get,
      HttpCode,
      HttpStatus,
      Post,
      Request,
      UseGuards
    } from '@nestjs/common';
    import { AuthGuard } from './auth.guard';
    import { AuthService } from './auth.service';
    import { ApiProperty, ApiBody, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
    
    class SignInDto {
      @ApiProperty({
        example: 'admin',
        description: 'Email address of the user',
        required: true,
      })
      username: string;
    }

    @Controller('auth')
    export class AuthController {
      constructor(private authService: AuthService) {}
    
      @ApiBody({ type: SignInDto })
      @HttpCode(HttpStatus.OK)
      @Post('login')
      signIn(@Body() signInDto: Record<string, any>) {
        return this.authService.signIn(signInDto.username);
      }

      
      @UseGuards(AuthGuard)
      @ApiBearerAuth('access-token') 
      @ApiSecurity('access-token')
      @Get('profile')
      getProfile(@Request() req) {
        return req.user;
      }
    }