import { Module, forwardRef } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthService } from './auth.service';
import { AccountRepository } from 'src/account/account.repository';
import { AuthController } from './auth.controller';
import { AccountModule } from 'src/account/account.module';
import { KakaoStrategy } from './strategies/kakao.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TradeModule } from '@src/trade/trade.module';
import { TradehistoryModule } from '@src/trade-history/trade-history.module';
import { AssetRepository } from '@src/asset/asset.repository';
import { AssetModule } from '@src/asset/asset.module';
import { AccountService } from '@src/account/account.service';
import { AssetService } from '@src/asset/asset.service';
import { CoinListService } from '@src/upbit/coin-list.service';
@Module({
	imports: [
		TypeOrmModule.forFeature([User, UserRepository]),
		JwtModule.register({
			global: true,
			secret: jwtConstants.secret,
			signOptions: { expiresIn: '6000s' },
		}),
		AccountModule,
		TradeModule,
		TradehistoryModule,
		PassportModule,
		AssetModule,
	],
	providers: [
		UserRepository,
		AccountRepository,
		AuthService,
		AssetService,
		UserService,
		JwtService,
		AccountService,
		GoogleStrategy,
		KakaoStrategy,
		CoinListService,
	],
	controllers: [AuthController, UserController],
	exports: [UserRepository],
})
export class AuthModule { }
