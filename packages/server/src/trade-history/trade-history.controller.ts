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
    Res
  } from '@nestjs/common';
  import { AuthGuard } from 'src/auth/auth.guard';
  import { ApiBearerAuth, ApiSecurity, ApiBody } from '@nestjs/swagger';
  import {Response} from "express";
import { TradeHistoryService } from './trade-history.service';
  
  @Controller('tradehistory')
  export class TradeHistoryController {
    constructor(
        private tradeHistoryService: TradeHistoryService
    ) {}
  
    @ApiBearerAuth('access-token')
    @ApiSecurity('access-token')
    @UseGuards(AuthGuard)
    @Get('tradehistoryData')
    async getMyTradeData(
      @Request() req,
      @Res() res: Response,
      @Query('coins') coins?: string,
    ) {
      const response = await this.tradeHistoryService.getMyTradeHistoryData(req.user, coins)
      return res.status(response.statusCode).json(response)
    }
  }
  