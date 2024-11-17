import { Body, Controller, Get, Post, Query, Param, Request, UseGuards } from '@nestjs/common';
import { TradeService } from './trade.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';

@Controller('trade')
export class TradeController {
	constructor(private tradeService: TradeService) {}

	@ApiBearerAuth('access-token') 
	@ApiSecurity('access-token')
  	@UseGuards(AuthGuard)
	@Get('calculate-percentage-buy/:moneyType')
	calculatePercentBuy(
        @Request() req,
		@Param('moneyType') moneyType: string,
		@Query('percent') percent: number,
	) {
		return this.tradeService.calculatePercentBuy(req.user, moneyType, percent);
	}

	@ApiBearerAuth('access-token') 
	@ApiSecurity('access-token')
  	@UseGuards(AuthGuard)
	@Post('buy')
	async buyTrade(
		@Body()  buyDto: Record<string, any>,
	){
		try {
            const response = await this.tradeService.buyTradeService(buyDto);
            return response;
        } catch (error) {
			if(error.response) return error.response;
			return error;
        }
	}
}

