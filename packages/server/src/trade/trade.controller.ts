import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BidService } from './trade-bid.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { AskService } from './trade-ask.service';

@Controller('trade')
export class TradeController {
  constructor(
    private bidService: BidService,
    private askService: AskService,
  ) {}

  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @UseGuards(AuthGuard)
  @Get('calculate-percentage-buy/:moneyType')
  calculatePercentBuy(
    @Request() req,
    @Param('moneyType') moneyType: string,
    @Query('percent') percent: number,
  ) {
    return this.bidService.calculatePercentBuy(req.user, moneyType, percent);
  }

  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @UseGuards(AuthGuard)
  @Post('bid')
  async bidTrade(@Request() req, @Body() bidDto: Record<string, any>) {
    try {
      const response = await this.bidService.createBidTrade(req.user, bidDto);
      return response;
    } catch (error) {
      return error.response;
    }
  }
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @UseGuards(AuthGuard)
  @Post('ask')
  async askTrade(@Request() req, @Body() askDto: Record<string, any>) {
    try {
      const response = await this.askService.createAskTrade(req.user, askDto);
      return response;
    } catch (error) {
      return error.response;
    }
  }
}
