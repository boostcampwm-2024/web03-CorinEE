import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards,
  } from '@nestjs/common';
  import { AuthGuard } from '../auth/auth.guard';
  import { AuthService } from '@src/auth/auth.service'; 
  import {
    ApiBody,
    ApiBearerAuth,
    ApiSecurity,
    ApiResponse,
  } from '@nestjs/swagger';
import { AccountService } from './account.service';

  @Controller('account')
  export class AccountController {
    constructor(private accountService: AccountService) {}
  
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('access-token')
    @ApiSecurity('access-token')
    @UseGuards(AuthGuard)
    @Get('myaccount')
    signIn(@Request() req) {
      return this.accountService.getMyAccountData(req.user);
    }
  }
  