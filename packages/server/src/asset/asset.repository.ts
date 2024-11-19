import { DataSource, Repository, QueryRunner } from 'typeorm';
import { Asset } from './asset.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AssetRepository extends Repository<Asset> {
  constructor(private dataSource: DataSource) {
    super(Asset, dataSource.createEntityManager());
  }
  async createAsset(buyDto, price, quantity, queryRunner) {
    try {
      const { typeReceived, account } = buyDto;
      const asset = new Asset();
      asset.assetName = typeReceived;
      asset.price = price;
      asset.quantity = quantity;
      asset.account = account;
      await queryRunner.manager.save(Asset, asset);
    } catch (e) {
      console.log(e);
    }
  }
  async updateAsset(asset, queryRunner) {
    try {
      await queryRunner.manager.save(Asset, asset);
    } catch (e) {
      console.log(e);
    }
  }
  async updateAssetQuantity(asset, queryRunner) {
    try {
      await queryRunner.manager
        .createQueryBuilder()
        .update(Asset)
        .set({ quantity: asset.quantity })
        .where('assetId = :assetId', { assetId: asset.assetId })
        .execute();
    } catch (e) {
      console.log(e);
    }
  }
  async updateAssetPrice(asset, queryRunner) {
    try {
      await queryRunner.manager
        .createQueryBuilder()
        .update(Asset)
        .set({ price: asset.price })
        .where('assetId = :assetId', { assetId: asset.assetId })
        .execute();
    } catch (e) {
      console.log(e);
    }
  }
  async getAsset(id,assetName, queryRunner){
    try {
      return await queryRunner.manager.findOne(Asset,{
        where: {
          account: {id: id},
          assetName: assetName
        },
      })
    } catch (error) {
      console.error('Error fetching asset:', error);
      throw new Error('Failed to fetch asset');
    }    
  }
}
