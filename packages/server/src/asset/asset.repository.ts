import { DataSource, Repository } from 'typeorm';
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
  async getAsset(account, assetName){
    try {
      return await this.createQueryBuilder('asset')
        .where('asset.assetName = :assetName', { assetName })
        .andWhere('asset.account = :accountId', { accountId: account.id })
        .getOne();
    } catch (error) {
      console.error('Error fetching asset:', error);
      throw new Error('Failed to fetch asset');
    }    
  }
}
