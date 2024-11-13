import { Body, Controller, Get, Query, Param, Request, UseGuards } from '@nestjs/common';
import { TradeService } from './trade.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('trade')
export class TradeController {
	constructor(private tradeService: TradeService) {}

  @UseGuards(AuthGuard)
	@Get('calculate-percentage-buy/:moneyType')
	calculatePercentBuy(
        @Request() req,
		@Param('moneyType') moneyType: string,
		@Query('percent') percent: number,
	) {
		return this.tradeService.calculatePercentBuy(req.user, moneyType, percent);
	}
}

