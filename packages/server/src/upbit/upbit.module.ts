import { Module } from '@nestjs/common';
import { UpbitService } from './upbit.service';
import { UpbitController } from './upbit.controller';
import { CoinListService } from './coin-list.service'
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [UpbitService, CoinListService],
  controllers: [UpbitController]
})
export class UpbitModule {}
