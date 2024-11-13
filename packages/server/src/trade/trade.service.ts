import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { AccountRepository } from 'src/account/account.repository';

@Injectable()
export class TradeService {
    constructor(
        private accountRepository: AccountRepository,
    ){}

    async calculatePercentBuy(user, moneyType: string, percent: number){
        const money = await this.accountRepository.getMyMoney(user,moneyType)
        
        return Number(money) * (percent / 100);
    }
}

