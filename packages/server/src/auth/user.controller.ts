import {
    Controller,
    Delete,
    HttpCode,
    HttpStatus,
    UseGuards,
    Logger,
    Request,
    Get,
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

    @ApiOperation({
      summary: '모든 유저의 id와 username 조회',
      description: '모든 유저의 id와 username을 배열 형태로 반환합니다.',
    })
    @ApiResponse({
      status: HttpStatus.OK,
      description: '유저 정보 조회 성공',
      type: [Object], // 반환 형태가 배열이므로 Object로 정의
    })
    @HttpCode(HttpStatus.OK)
    @Get('all-users')
    async getAllUsers(): Promise<{ id: number; username: string }[]> {
      this.logger.log(`모든 유저 정보 조회 시작`);
      try {
        const usersInfo = await this.userService.getAllUsersInfo();
        this.logger.log(`모든 유저 정보 조회 완료`);
        return usersInfo;
      } catch (error) {
        this.logger.error(`모든 유저 정보 조회 실패: ${error.message}`, error.stack);
        throw error;
      }
    }

    @ApiOperation({
      summary: '모든 유저의 id, username 및 총 자산 정보 조회',
      description: '모든 유저의 id, username, 총 자산 정보를 배열 형태로 반환합니다.',
    })
    @ApiResponse({
      status: HttpStatus.OK,
      description: '유저 정보 조회 성공',
      type: [Object], // 반환 형태가 배열이므로 Object로 정의
    })
    @HttpCode(HttpStatus.OK)
    @Get('all-users-account')
    async getAllUsersWithTotalAsset(): Promise<any[]> {
      this.logger.log(`모든 유저 정보 조회 시작`);
      try {
        const usersInfo = await this.userService.getAllUsersInfoWithTotalAsset();
        this.logger.log(`모든 유저 정보 조회 완료`);
        return usersInfo;
      } catch (error) {
        this.logger.error(`모든 유저 정보 조회 실패: ${error.message}`, error.stack);
        throw error;
      }
    }
  }
  