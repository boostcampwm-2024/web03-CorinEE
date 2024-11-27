import {
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Request,
  HttpStatus,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@src/auth/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { FavoriteDto, FavoriteResponseDto } from './dtos/favorite.dto';
import { FavoriteService } from './favorite.service';
import { Favorite } from './favorite.entity';

@ApiTags('즐겨찾기 API')
@Controller('favorite')
@ApiBearerAuth('access-token')
@ApiSecurity('access-token')
@UseGuards(AuthGuard)
export class FavoriteController {
  private readonly logger = new Logger(FavoriteController.name);

  constructor(private readonly favoriteService: FavoriteService) {}

  @ApiOperation({
    summary: '즐겨찾기 조회',
    description: '사용자의 즐겨찾기 목록을 조회합니다.',
  })
  @ApiQuery({
    name: 'assetName',
    required: false,
    type: String,
    description: '자산 이름으로 필터링 (선택사항)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '즐겨찾기 조회 성공',
    type: FavoriteResponseDto,
  })
  @Get()
  async getFavorites(
    @Request() req,
    @Query('assetName') assetName?: string,
  ): Promise<FavoriteResponseDto> {
    this.logger.log(
      `즐겨찾기 조회 시작: userId=${req.user.userId}, assetName=${assetName || 'all'}`,
    );
    try {
      return await this.favoriteService.getFavorites(req.user, assetName);
    } catch (error) {
      this.logger.error(`즐겨찾기 조회 실패: ${error.message}`, error.stack);
      throw error;
    }
  }

  @ApiOperation({
    summary: '즐겨찾기 추가',
    description: '새로운 즐겨찾기를 추가합니다.',
  })
  @ApiQuery({
    name: 'assetName',
    required: true,
    type: String,
    description: '추가할 자산 이름',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '즐겨찾기 추가 성공',
    type: FavoriteDto,
  })
  @Post()
  async createFavorite(
    @Query('assetName') assetName: string,
    @Request() req,
  ): Promise<FavoriteDto | Favorite> {
    this.logger.log(
      `즐겨찾기 추가 시작: userId=${req.user.userId}, assetName=${assetName}`,
    );
    try {
      return await this.favoriteService.createFavorite(req.user, assetName);
    } catch (error) {
      this.logger.error(`즐겨찾기 추가 실패: ${error.message}`, error.stack);
      throw error;
    }
  }

  @ApiOperation({
    summary: '즐겨찾기 삭제',
    description: '즐겨찾기를 삭제합니다.',
  })
  @ApiQuery({
    name: 'assetName',
    required: true,
    type: String,
    description: '삭제할 자산 이름',
  })
  @Delete()
  async deleteFavorite(
    @Query('assetName') assetName: string,
    @Request() req,
  ): Promise<void> {
    this.logger.log(
      `즐겨찾기 삭제 시작: userId=${req.user.userId}, assetName=${assetName}`,
    );
    try {
      await this.favoriteService.deleteFavorite(req.user, assetName);
    } catch (error) {
      this.logger.error(`즐겨찾기 삭제 실패: ${error.message}`, error.stack);
      throw error;
    }
  }

  @ApiOperation({
    summary: '즐겨찾기 토글',
    description: '즐겨찾기가 없으면 추가하고, 있으면 삭제합니다.',
  })
  @ApiQuery({
    name: 'assetName',
    required: true,
    type: String,
    description: '토글할 자산 이름',
  })
  @Post('toggle')
  async toggleFavorite(
    @Query('assetName') assetName: string,
    @Request() req,
  ): Promise<void | FavoriteDto> {
    this.logger.log(
      `즐겨찾기 토글 시작: userId=${req.user.userId}, assetName=${assetName}`,
    );
    try {
      return await this.favoriteService.toggleFavorite(req.user, assetName);
    } catch (error) {
      this.logger.error(`즐겨찾기 토글 실패: ${error.message}`, error.stack);
      throw error;
    }
  }
}
