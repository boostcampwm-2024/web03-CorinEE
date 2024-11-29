import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetRepository } from './asset.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

@Module({
	imports: [TypeOrmModule.forFeature([AssetRepository]), 
  HttpModule],
	controllers: [],
	providers: [
		AssetService,
		AssetRepository,
	],
	exports: [AssetRepository],
})
export class AssetModule {}
