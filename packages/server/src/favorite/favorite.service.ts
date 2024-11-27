import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  HttpStatus,
} from '@nestjs/common';
import { FavoriteRepository } from './favorite.repository';
import { FavoriteDto, FavoriteResponseDto } from './dtos/favorite.dto';
import { UserDto } from '@src/account/dtos/my-account.response.dto';
import { Favorite } from './favorite.entity';

@Injectable()
export class FavoriteService {
  private readonly logger = new Logger(FavoriteService.name);

  constructor(private readonly favoriteRepository: FavoriteRepository) {}

  async getFavorites(
    user: UserDto,
    assetName?: string,
  ): Promise<FavoriteResponseDto> {
    const where = {
      user: { id: user.userId },
      ...(assetName && { assetName }),
    };

    const result = await this.favoriteRepository.find({ where });

    return {
      statusCode: HttpStatus.OK,
      result: result,
    };
  }

  async createFavorite(user: UserDto, assetName: string): Promise<Favorite> {
    const existing = await this.favoriteRepository.findOne({
      where: { user: { id: user.userId }, assetName },
    });

    if (existing) {
      throw new ConflictException('이미 즐겨찾기에 추가된 자산입니다.');
    }

    return await this.favoriteRepository.save({
      user: { id: user.userId },
      assetName,
    });
  }

  async deleteFavorite(user: UserDto, assetName: string): Promise<void> {
    const result = await this.favoriteRepository.delete({
      user: { id: user.userId },
      assetName,
    });

    if (result.affected === 0) {
      throw new NotFoundException('해당 즐겨찾기를 찾을 수 없습니다.');
    }
  }

  async toggleFavorite(user: UserDto, assetName: string): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: {
        user: { id: user.userId },
        assetName,
      },
    });

    if (favorite) {
      await this.deleteFavorite(user, assetName);
    } else {
      await this.createFavorite(user, assetName);
    }
  }
}
