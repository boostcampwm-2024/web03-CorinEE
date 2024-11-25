import { Injectable } from '@nestjs/common';
import { FavoriteRepository } from './favorite.repository';

@Injectable()
export class FavoriteService {
  constructor(private favoriteRepository: FavoriteRepository) {}

  async getFavorites(user, assetName) {
    if (assetName) {
      const result = await this.favoriteRepository.find({
        where: {
          user: { id: user.userId },
          assetName,
        },
      });
      return {
        statusCode: 200,
        result,
      };
    } else {
      const result = await this.favoriteRepository.find({
        where: { user: { id: user.userId } },
      });
      console.log(result);
      return {
        statusCode: 200,
        result,
      };
    }
  }

  async createFavorite(user, assetName) {
    return await this.favoriteRepository.save({
      user: { id: user.userId },
      assetName,
    });
  }

  async deleteFavorite(user, assetName) {
    return await this.favoriteRepository.delete({
      user: { id: user.userId },
      assetName,
    });
  }

  async toggleFavorite(user, assetName) {
    const favorite = await this.favoriteRepository.find({
      where: {
        user: { id: user.userId },
        assetName,
      },
    });
    console.log(favorite);
    if (favorite.length > 0) {
      return await this.deleteFavorite(user, assetName);
    } else {
      return await this.createFavorite(user, assetName);
    }
  }
}
