import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  Request,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { BidService } from './trade-bid.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiSecurity, ApiBody } from '@nestjs/swagger';
import { AskService } from './trade-ask.service';
import { TradeDto } from './dtos/trade.dto';
import { TradeService } from './trade.service';

@Controller('trade')
export class TradeController {
  constructor(
    private bidService: BidService,
    private askService: AskService,
    private tradeService: TradeService
  ) {}

  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @UseGuards(AuthGuard)
  @Get('calculate-percentage-bid/:moneyType')
  calculatePercentBid(
    @Request() req,
    @Param('moneyType') moneyType: string,
    @Query('percent') percent: number,
  ) {
    return this.bidService.calculatePercentBuy(req.user, moneyType, percent);
  }

  @ApiBody({ type: TradeDto })
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @UseGuards(AuthGuard)
  @Post('bid')
  async bidTrade(@Request() req, @Body() bidDto: Record<string, any>) {
    try {
      const response = await this.bidService.createBidTrade(req.user, bidDto);
      return response;
    } catch (error) {
      return error;
    }
  }

  @ApiBody({ type: TradeDto })
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @UseGuards(AuthGuard)
  @Post('ask')
  async askTrade(@Request() req, @Body() askDto: Record<string, any>) {
    try {
      const response = await this.askService.createAskTrade(req.user, askDto);
      return response;
    } catch (error) {
      return error;
    }
  }

  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @UseGuards(AuthGuard)
  @Get('calculate-percentage-ask/:moneyType')
  calculatePercentAsk(
    @Request() req,
    @Param('moneyType') moneyType: string,
    @Query('percent') percent: number,
  ) {
    return this.askService.calculatePercentBuy(req.user, moneyType, percent);
  }
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @UseGuards(AuthGuard)
  @Get('check-coindata/:coin')
  getMyCoinData(
    @Request() req,
    @Param('coin') coin: string,
  ) {
    return this.tradeService.checkMyCoinData(req.user, coin)
  }
}
