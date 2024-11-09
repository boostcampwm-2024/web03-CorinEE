import { Module } from '@nestjs/common';
import { UpbitService } from './upbit.service';
import { UpbitController } from './upbit.controller';

@Module({
  providers: [UpbitService],
  controllers: [UpbitController]
})
export class UpbitModule {}
