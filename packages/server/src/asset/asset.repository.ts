import { DataSource, Repository, QueryRunner } from 'typeorm';
import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { Account } from '@src/account/account.entity';
import { Asset } from './asset.entity';

@Injectable()
export class AssetRepository extends Repository<Asset> {
  private readonly logger = new Logger(AssetRepository.name);

  constructor(private readonly dataSource: DataSource) {
    super(Asset, dataSource.createEntityManager());
  }

  async createAsset(
    typeReceived: string,
    account: Account,
    price: number,
    quantity: number,
    queryRunner: QueryRunner,
  ): Promise<Asset> {
    this.logger.log(
      `자산 생성 시작: type=${typeReceived}, accountId=${account.id}`,
    );
    try {
      const asset = new Asset();
      asset.assetName = typeReceived;
      asset.price = price;
      asset.quantity = quantity;
      asset.availableQuantity = quantity;
      asset.account = account;

      const savedAsset = await queryRunner.manager.save(Asset, asset);
      this.logger.log(`자산 생성 완료: assetId=${savedAsset.assetId}`);

      return savedAsset;
    } catch (error) {
      this.logger.error(`자산 생성 실패: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        '자산 생성 중 오류가 발생했습니다.',
      );
    }
  }

  async updateAssetQuantityPrice(
    asset: Asset,
    queryRunner: QueryRunner,
  ): Promise<void> {
    this.logger.log(`자산 수량/가격 업데이트 시작: assetId=${asset.assetId}`);
    try {
      await queryRunner.manager
        .createQueryBuilder()
        .update(Asset)
        .set({
          quantity: asset.quantity,
          price: asset.price,
          availableQuantity: asset.availableQuantity,
        })
        .where('assetId = :assetId', { assetId: asset.assetId })
        .execute();

      this.logger.log(`자산 수량/가격 업데이트 완료: assetId=${asset.assetId}`);
    } catch (error) {
      this.logger.error(
        `자산 수량/가격 업데이트 실패: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        '자산 업데이트 중 오류가 발생했습니다.',
      );
    }
  }

  async updateAssetQuantity(
    asset: Asset,
    queryRunner: QueryRunner,
  ): Promise<void> {
    this.logger.log(`자산 수량 업데이트 시작: assetId=${asset.assetId}`);
    try {
      await queryRunner.manager
        .createQueryBuilder()
        .update(Asset)
        .set({ quantity: asset.quantity })
        .where('assetId = :assetId', { assetId: asset.assetId })
        .execute();

      this.logger.log(`자산 수량 업데이트 완료: assetId=${asset.assetId}`);
    } catch (error) {
      this.logger.error(
        `자산 수량 업데이트 실패: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        '자산 수량 업데이트 중 오류가 발생했습니다.',
      );
    }
  }

  async updateAssetAvailableQuantity(
    asset: Asset,
    queryRunner: QueryRunner,
  ): Promise<void> {
    this.logger.log(`거래가능 수량 업데이트 시작: assetId=${asset.assetId}`);
    try {
      await queryRunner.manager
        .createQueryBuilder()
        .update(Asset)
        .set({ availableQuantity: asset.availableQuantity })
        .where('assetId = :assetId', { assetId: asset.assetId })
        .execute();

      this.logger.log(`거래가능 수량 업데이트 완료: assetId=${asset.assetId}`);
    } catch (error) {
      this.logger.error(
        `거래가능 수량 업데이트 실패: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        '거래가능 수량 업데이트 중 오류가 발생했습니다.',
      );
    }
  }

  async updateAssetPrice(
    asset: Asset,
    queryRunner: QueryRunner,
  ): Promise<void> {
    this.logger.log(`자산 가격 업데이트 시작: assetId=${asset.assetId}`);
    try {
      await queryRunner.manager
        .createQueryBuilder()
        .update(Asset)
        .set({
          price: asset.price,
          quantity: asset.quantity,
        })
        .where('assetId = :assetId', { assetId: asset.assetId })
        .execute();

      this.logger.log(`자산 가격 업데이트 완료: assetId=${asset.assetId}`);
    } catch (error) {
      this.logger.error(
        `자산 가격 업데이트 실패: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        '자산 가격 업데이트 중 오류가 발생했습니다.',
      );
    }
  }

  async getAsset(
    id: number,
    assetName: string,
    queryRunner: QueryRunner,
  ): Promise<Asset> {
    this.logger.log(`자산 조회 시작: accountId=${id}, assetName=${assetName}`);
    try {
      const asset = await queryRunner.manager.findOne(Asset, {
        where: {
          account: { id },
          assetName,
        },
      });

      this.logger.log(
        `자산 조회 완료: ${asset ? `assetId=${asset.assetId}` : '자산 없음'}`,
      );
      return asset;
    } catch (error) {
      this.logger.error(`자산 조회 실패: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        '자산 조회 중 오류가 발생했습니다.',
      );
    }
  }
}
