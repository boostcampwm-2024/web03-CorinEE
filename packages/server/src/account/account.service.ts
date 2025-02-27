import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AssetRepository } from '@src/asset/asset.repository';
import { CoinDto, MyAccountDto } from './dtos/my-account.dto';
import { CoinDataUpdaterService } from '@src/upbit/coin-data-updater.service';
import { CURRENCY_CONSTANTS } from './constants/currency.constants';
import {
  AccountResponseDto,
  MyAccountResponseDto,
  UserDto,
} from './dtos/my-account.response.dto';
import { AccountRepository } from './account.repository';
import { Asset } from '@src/asset/asset.entity';
import { AssetService } from '@src/asset/asset.service';
import { CoinListService } from '@src/upbit/coin-list.service';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly assetRepository: AssetRepository,
    private readonly assetService: AssetService,
    private readonly coinListService: CoinListService,
    private readonly coinDataUpdaterService: CoinDataUpdaterService,
  ) {}

  async getMyAccountData(
    user: UserDto,
  ): Promise<MyAccountResponseDto | AccountResponseDto> {
    this.logger.log(`계정 데이터 조회 시작: ${user.userId}`);

    const account = await this.accountRepository.findOne({
      where: { user: { id: user.userId } },
    });

    if (!account) {
      this.logger.warn(`등록되지 않은 사용자 접근: ${user.userId}`);
      throw new UnauthorizedException('등록되지 않은 사용자입니다.');
    }

    try {
      const accountData = new MyAccountDto();
      let totalPrice = 0;

      const myCoins = await this.assetRepository.find({
        where: { account: { id: account.id } },
      });

      const coinNameData = this.coinDataUpdaterService.getCoinNameList();
      const coins: CoinDto[] = this.mapCoinsData(myCoins, coinNameData);
      totalPrice = this.calculateTotalPrice(coins);

      accountData.KRW = account.KRW;
      accountData.availableKRW = account.availableKRW;
      accountData.total_bid = totalPrice;
      accountData.coins = coins;

      this.logger.log(`계정 데이터 조회 완료: ${user.userId}`);

      return {
        KRW: accountData.KRW,
        availableKRW: accountData.availableKRW,
        total_bid: accountData.total_bid,
        coins: accountData.coins,
      };
    } catch (error) {
      this.logger.error(`계정 데이터 조회 실패: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getTotalAssetData(accountId: number): Promise<any[]> {
    const userCoins = await this.assetRepository.getAssets(accountId);
    const CoinTickers = this.coinListService.getCoinTickers();
    return this.assetService.calculateEvaluations(userCoins, CoinTickers);
  }

  async getEvaluatedAssets(accountId: number): Promise<any> {

    const coinEvaluations = await this.getTotalAssetData(accountId);

    let totalAssetValue = 0;
    let totalKRW = 0;

    coinEvaluations.forEach((coin) => {
      totalAssetValue += coin.evaluation_amount;
    });

    const account = await this.accountRepository.findOne({
      where: { id: accountId },
    });
    if (account) {
      totalKRW = account.KRW;
    }

    const totalAsset = totalAssetValue + totalKRW;

    return {
      totalAsset: totalAsset,
      coinEvaluations,
      KRW: totalKRW,
    };
  }

  private mapCoinsData(
    myCoins: Asset[],
    coinNameData: Map<string, string>,
  ): CoinDto[] {
    return myCoins.map((myCoin) => {
      const name = myCoin.assetName;
      return {
        img_url: `${CURRENCY_CONSTANTS.UPBIT_IMAGE_URL}${name}.png`,
        koreanName: this.getKoreanName(name, coinNameData),
        market: name,
        quantity: myCoin.quantity,
        availableQuantity: myCoin.availableQuantity,
        price: myCoin.price,
        averagePrice: myCoin.price / myCoin.quantity,
      };
    });
  }

  private getKoreanName(
    name: string,
    coinNameData: Map<string, string>,
  ): string {
    const markets = ['KRW', 'BTC', 'USDT'];
    for (const market of markets) {
      const koreanName = coinNameData.get(`${market}-${name}`);
      if (koreanName) return koreanName;
    }
    return '';
  }

  private calculateTotalPrice(coins: CoinDto[]): number {
    return coins.reduce((total, coin) => total + coin.price, 0);
  }
}
