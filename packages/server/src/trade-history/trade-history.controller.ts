import {
  Controller,
  Get,
  Query,
  UseGuards,
  Logger,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@src/auth/auth.guard';
import { 
  ApiBearerAuth, 
  ApiOperation, 
  ApiResponse, 
  ApiSecurity, 
  ApiTags,
  ApiQuery 
} from '@nestjs/swagger';
import { TradeHistoryService } from './trade-history.service';
import { TradeHistoryResponseDto } from './dtos/trade-history.dto';

@ApiTags('거래 내역 API')
@Controller('trade-history')
@ApiBearerAuth('access-token')
@ApiSecurity('access-token')
@UseGuards(AuthGuard)
export class TradeHistoryController {
  private readonly logger = new Logger(TradeHistoryController.name);

  constructor(private readonly tradeHistoryService: TradeHistoryService) {}

  @ApiOperation({ 
    summary: '거래 내역 조회',
    description: '사용자의 거래 내역을 조회합니다. 코인을 지정하면 해당 코인의 거래 내역만 조회됩니다.' 
  })
  @ApiQuery({ 
    name: 'coins', 
    required: false, 
    type: String,
    example: 'BTC-KRW',
    description: '조회할 코인 페어 (예: BTC-KRW)' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK,
    description: '거래 내역 조회 성공',
    type: TradeHistoryResponseDto 
  })
  @Get('tradehistoryData')
  async getTradeHistory(
    @Request() req,
    @Query('coins') coins?: string,
  ): Promise<TradeHistoryResponseDto> {
    this.logger.log(`거래 내역 조회 시작: userId=${req.user.userId}, coins=${coins || 'all'}`);
    try {
      return await this.tradeHistoryService.getMyTradeHistoryData(req.user, coins);
    } catch (error) {
      this.logger.error(`거래 내역 조회 실패: ${error.message}`, error.stack);
      throw error;
    }
  }
}