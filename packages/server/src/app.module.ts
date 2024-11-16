import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpbitModule } from './upbit/upbit.module';
import getTypeOrmConfig from './configs/typeorm.config';
import { HealthModule } from './health/health.module';
import { AccountModule } from './account/account.module';
import { TradeModule } from './trade/trade.module';
import { setupSshTunnel } from './configs/ssh-tunnel';
import getRedisClient from './configs/redis.config';
@Module({
  imports: [
    AuthModule,
    HealthModule,
    AccountModule,
    TradeModule,
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        await setupSshTunnel();
        getRedisClient(); // Redis 연결 초기화
        return await getTypeOrmConfig(); // TypeORM 설정 가져오기
      },
    }),
    UpbitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
