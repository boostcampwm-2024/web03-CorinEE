import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { Response } from 'express';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @UseGuards(AuthGuard)
  @Get('myaccount')
  async signIn(@Request() req, @Res() res: Response) {
    try {
      const response = await this.accountService.getMyAccountData(req.user);
      if (response instanceof UnauthorizedException) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: response.message });
      }

      return res.status(response.statusCode).json(response.message);
    } catch (error) {
      return res.status(error.statusCode).json(error);
    }
  }
}
