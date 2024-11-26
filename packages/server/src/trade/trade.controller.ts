import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  Request,
  UseGuards,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { BidService } from './trade-bid.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiBearerAuth,
  ApiSecurity,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AskService } from './trade-ask.service';
import { TradeService } from './trade.service';
import { TradeData } from './dtos/trade.interface';
import { TradeAskDto, TradeDto } from './dtos/trade.dto';

@ApiTags('Trade')
@ApiBearerAuth('access-token')
@ApiSecurity('access-token')
@UseGuards(AuthGuard)
@Controller('trade')
export class TradeController {
  constructor(
    private readonly bidService: BidService,
    private readonly askService: AskService,
    private readonly tradeService: TradeService,
  ) {}

  @Get('calculate-percentage-bid/:moneyType')
  @ApiOperation({ summary: '구매 퍼센트 계산' })
  @ApiParam({ name: 'moneyType', description: '화폐 타입', example: 'KRW' })
  @ApiQuery({ name: 'percent', description: '퍼센트', example: 50 })
  @ApiResponse({ status: HttpStatus.OK, description: '구매 퍼센트 계산 결과' })
  calculatePercentBid(
    @Request() req,
    @Param('moneyType') moneyType: string,
    @Query('percent') percent: number,
  ) {
    return this.bidService.calculatePercentBuy(req.user, moneyType, percent);
  }

  @Post('bid')
  @ApiOperation({ summary: '구매 주문 생성' })
  @ApiBody({ type: TradeDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '구매 주문 생성 성공',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '잘못된 요청' })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: '처리 불가능한 엔티티',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: '서버 오류',
  })
  async bidTrade(@Request() req, @Body() bidDto: TradeData) {
    return this.bidService.createBidTrade(req.user, bidDto);
  }

  @Post('ask')
  @ApiOperation({ summary: '판매 주문 생성' })
  @ApiBody({ type: TradeAskDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '판매 주문 생성 성공',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '잘못된 요청' })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: '처리 불가능한 엔티티',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: '서버 오류',
  })
  async askTrade(@Request() req, @Body() askDto: TradeData) {
    return this.askService.createAskTrade(req.user, askDto);
  }

  @Get('calculate-percentage-ask/:moneyType')
  @ApiOperation({ summary: '판매 퍼센트 계산' })
  @ApiParam({ name: 'moneyType', description: '화폐 타입', example: 'KRW' })
  @ApiQuery({ name: 'percent', description: '퍼센트', example: 50 })
  @ApiResponse({ status: HttpStatus.OK, description: '판매 퍼센트 계산 결과' })
  calculatePercentAsk(
    @Request() req,
    @Param('moneyType') moneyType: string,
    @Query('percent') percent: number,
  ) {
    return this.askService.calculatePercentSell(req.user, moneyType, percent);
  }

  @Get('check-coindata')
  @ApiOperation({ summary: '사용자 코인 데이터 조회' })
  @ApiQuery({
    name: 'coin',
    description: '코인 이름',
    example: 'BTC',
    required: false,
  })
  @ApiResponse({ status: HttpStatus.OK, description: '사용자 보유 코인' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '사용자 미보유 코인',
  })
  async getMyCoinData(@Request() req, @Query('coin') coin?: string) {
    return this.tradeService.checkMyCoinData(req.user, coin);
  }

  @Get('tradeData')
  @ApiOperation({ summary: '사용자 거래 내역 조회' })
  @ApiQuery({
    name: 'coin',
    description: '코인 이름',
    required: false,
    example: 'BTC',
  })
  @ApiResponse({ status: HttpStatus.OK, description: '사용자 거래 내역 있음' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '사용자 거래 내역 없음',
  })
  async getMyTradeData(@Request() req, @Query('coin') coin?: string) {
    return this.tradeService.getMyTradeData(req.user, coin);
  }

  @Delete('tradeData')
  @ApiOperation({ summary: '사용자 거래 취소' })
  @ApiQuery({ name: 'tradeId', description: '거래 ID', example: 1 })
  @ApiQuery({ name: 'tradeType', description: '거래 타입', example: 'buy' })
  @ApiResponse({ status: HttpStatus.OK, description: '거래 취소 성공' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '잘못된 요청' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: '서버 오류',
  })
  async deleteMyTrade(
    @Request() req,
    @Query('tradeId') tradeId: number,
    @Query('tradeType') tradeType: string,
  ) {
    if (tradeType === 'buy') {
      return this.tradeService.deleteMyBidTrade(req.user, tradeId);
    } else {
      return this.tradeService.deleteMyAskTrade(req.user, tradeId);
    }
  }
}
