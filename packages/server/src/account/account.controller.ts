import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiSecurity,
} from '@nestjs/swagger';
import { AccountService } from './account.service';
import { Request } from 'express';
import { AccountResponseDto, MyAccountResponseDto } from './dtos/my-account.response.dto';

@ApiTags('계정 API')
@Controller('account')
export class AccountController {
  private readonly logger = new Logger(AccountController.name);

  constructor(private readonly accountService: AccountService) {}

  @ApiOperation({
    summary: '내 계정 정보 조회',
    description: '현재 로그인한 사용자의 계정 정보를 조회합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '계정 정보 조회 성공',
    type: AccountResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '인증되지 않은 사용자',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: '서버 에러',
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @UseGuards(AuthGuard)
  @Get('myaccount')
  async getMyAccount(@Req() req: Request): Promise<MyAccountResponseDto|AccountResponseDto> {
    this.logger.log(`계정 정보 조회 시작: ${req.user['userId']}`);
    try {
      const response = await this.accountService.getMyAccountData(req.user);
      this.logger.log(`계정 정보 조회 완료: ${req.user['userId']}`);
      return response;
    } catch (error) {
      this.logger.error(`계정 정보 조회 실패: ${error.message}`, error.stack);
      throw error;
    }
  }

  
}
