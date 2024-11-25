import { Module } from '@nestjs/common';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { FavoriteRepository } from './favorite.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './favorite.entity';

@Module({
    imports: [
		TypeOrmModule.forFeature([Favorite]),
	],
  controllers: [FavoriteController],
  providers: [FavoriteService, FavoriteRepository],
  exports: [FavoriteRepository],
})
export class FavoriteModule {}
