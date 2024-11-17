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
import { RedisModule } from './redis/redis.module';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { ScheduleModule } from './schedule/schedule.module';
import { CleanupService } from './schedule/clean-up.service';

@Module({
  imports: [
    AuthModule,
    HealthModule,
    AccountModule,
    TradeModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return getTypeOrmConfig();
      },
    }),
    UpbitModule,
    RedisModule,
    NestScheduleModule.forRoot(),
    ScheduleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
