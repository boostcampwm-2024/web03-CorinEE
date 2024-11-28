import {
    Controller,
    Delete,
    HttpCode,
    HttpStatus,
    UseGuards,
    Logger,
    Request,
  } from '@nestjs/common';
  import { AuthGuard } from './auth.guard';
  import { UserService } from './user.service';
  import { ApiBearerAuth, ApiSecurity, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
  
  @ApiTags('유저 API')
  @Controller('user')
  export class UserController {
    private readonly logger = new Logger(UserController.name);
  
    constructor(
      private readonly userService: UserService,
    ) {}
  
    @ApiOperation({
      summary: '유저 데이터 초기화 및 새 계정 생성',
      description: '유저의 계정, 에셋, 트레이드, 트레이드 히스토리를 삭제하고 새 계정을 생성합니다.',
    })
    @ApiResponse({
      status: HttpStatus.OK,
      description: '유저 데이터 초기화 성공 및 새 계정 생성 완료',
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: '유저를 찾을 수 없음',
    })
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('access-token')
    @ApiSecurity('access-token')
    @UseGuards(AuthGuard)
    @Delete('reset')
    async resetUserData(@Request() req): Promise<{ message: string }> {
      this.logger.log(`유저 데이터 초기화 시작: User ID ${req.user.userId}`);
      try {
        await this.userService.resetUserData(req.user.userId);
        this.logger.log(`유저 데이터 초기화 완료: User ID ${req.user.userId}`);
        return { message: '유저 데이터 초기화 및 새 계정 생성이 완료되었습니다.' };
      } catch (error) {
        this.logger.error(`유저 데이터 초기화 실패: ${error.message}`, error.stack);
        throw error;
      }
    }
  }
  