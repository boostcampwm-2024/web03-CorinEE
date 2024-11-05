// src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import getTypeOrmConfig from './configs/typeorm.config';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return await getTypeOrmConfig(); // SSH 터널링이 완료된 후 TypeORM 설정 로드
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
