import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpbitModule } from './upbit/upbit.module';
import getTypeOrmConfig from './configs/typeorm.config';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    AuthModule,
    HealthModule,
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return await getTypeOrmConfig(); // SSH 터널링이 완료된 후 TypeORM 설정 로드
      },
    }),
    UpbitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
