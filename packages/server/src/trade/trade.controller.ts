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
	Res,
} from '@nestjs/common';
import { BidService } from './trade-bid.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiSecurity, ApiBody, ApiQuery } from '@nestjs/swagger';
import { AskService } from './trade-ask.service';
import { TradeDto } from './dtos/trade.dto';
import { TradeService } from './trade.service';
import { Response } from 'express';

@ApiBearerAuth('access-token')
@ApiSecurity('access-token')
@UseGuards(AuthGuard)
@Controller('trade')
export class TradeController {
	constructor(
		private bidService: BidService,
		private askService: AskService,
		private tradeService: TradeService,
	) {}

	@Get('calculate-percentage-bid/:moneyType')
	calculatePercentBid(
		@Request() req,
		@Param('moneyType') moneyType: string,
		@Query('percent') percent: number,
	) {
		return this.bidService.calculatePercentBuy(req.user, moneyType, percent);
	}

	@ApiBody({ type: TradeDto })
	@Post('bid')
	async bidTrade(
		@Request() req,
		@Body() bidDto: Record<string, any>,
		@Res() res: Response,
	) {
		try {
			const response = await this.bidService.createBidTrade(req.user, bidDto);
			return res.status(200).json(response);
		} catch (error) {
			return res.status(error.status).json({
				message: error.message || '서버오류입니다.',
				error: error?.response || null,
			});
		}
	}

	@ApiBody({ type: TradeDto })
	@Post('ask')
	async askTrade(
		@Request() req,
		@Body() askDto: Record<string, any>,
		@Res() res: Response,
	) {
		try {
			const response = await this.askService.createAskTrade(req.user, askDto);
			return res.status(200).json(response);
		} catch (error) {
			return res.status(error.status).json({
				message: error.message || '서버오류입니다.',
				error: error?.response || null,
			});
		}
	}

	@Get('calculate-percentage-ask/:moneyType')
	calculatePercentAsk(
		@Request() req,
		@Param('moneyType') moneyType: string,
		@Query('percent') percent: number,
	) {
		return this.askService.calculatePercentBuy(req.user, moneyType, percent);
	}

	@Get('check-coindata/:coin')
	async getMyCoinData(
		@Request() req,
		@Param('coin') coin: string,
		@Res() res: Response,
	) {
		const response = await this.tradeService.checkMyCoinData(req.user, coin);
		return res.status(response.statusCode).json(response);
	}

	@ApiQuery({ name: 'coin', required: false, type: String })
	@Get('tradeData/:coin?')
	async getMyTradeData(
		@Request() req,
		@Res() res: Response,
		@Param('coin') coin?: string,
	) {
		const response = await this.tradeService.getMyTradeData(req.user, coin);
		return res.status(response.statusCode).json(response);
	}

	@Delete('tradeData')
	async deleteMyTrade(
		@Request() req,
		@Res() res: Response,
		@Query('tradeId') tradeId: Number,
		@Query('tradeType') tradeType: string,
	) {
		try {
			let response;
			if (tradeType === 'buy')
				response = await this.tradeService.deleteMyBidTrade(req.user, tradeId);
			else
				response = await this.tradeService.deleteMyAskTrade(req.user, tradeId);

			return res.status(response.statusCode).json(response);
		} catch (error) {
			return res.status(error.status).json({
				message: error.message || '서버오류입니다.',
				error: error?.response || null,
			});
		}
	}
}
