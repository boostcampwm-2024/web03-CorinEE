import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AssetRepository } from '@src/asset/asset.repository';
import { UPBIT_IMAGE_URL } from 'common/upbit';
import { AccountRepository } from 'src/account/account.repository';
import { MyAccountDto } from './dtos/myAccount.dto';
import { CoinDataUpdaterService } from '@src/upbit/coin-data-updater.service';

@Injectable()
export class AccountService {
  constructor(
    private accountRepository: AccountRepository,
    private assetRepository: AssetRepository,
    private coinDataUpdaterService: CoinDataUpdaterService,
  ) {}

  async getMyAccountData(user) {
    const accountData: MyAccountDto = new MyAccountDto();

    const account = await this.accountRepository.findOne({
      where: { user: { id: user.userId } },
    });
    if (!account) {
      return new UnauthorizedException({
        statusCode: 401,
        message: '등록되지 않은 사용자입니다.',
      });
    }
    const KRW = account.KRW;
    let total_price = 0;

    const myCoins = await this.assetRepository.find({
      where: { account: { id: account.id } },
    });
    const coinNameData = this.coinDataUpdaterService.getCoinNameList();
    const coins = [];
    myCoins.forEach((myCoin) => {
      const name = myCoin.assetName;
      const coin = {
        img_url: `${UPBIT_IMAGE_URL}${name}.png`,
        koreanName:
          coinNameData.get(`KRW-${name}`) ||
          coinNameData.get(`BTC-${name}`) ||
          coinNameData.get(`USDT-${name}`),
        market: name,
        quantity: myCoin.quantity,
        availableQuantity: myCoin.availableQuantity,
        price: myCoin.price,
        averagePrice: myCoin.price / myCoin.quantity,
      };
      coins.push(coin);
      total_price += myCoin.price;
    });
    accountData.KRW = KRW;
    accountData.total_bid = total_price;
    accountData.coins = coins;
    return {
      statusCode: 200,
      message: accountData,
    };
  }
}
