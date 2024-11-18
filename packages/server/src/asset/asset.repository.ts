import { DataSource, Repository } from 'typeorm';
import { Asset } from './asset.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AssetRepository extends Repository<Asset> {
  constructor(private dataSource: DataSource) {
    super(Asset, dataSource.createEntityManager());
  }
  async createAsset(buyDto, currentCoinPrice, account, queryRunner) {
    try {
      const { typeReceived, receivedAmount } = buyDto;
      const asset = new Asset();
      asset.assetName = typeReceived;
      asset.price = currentCoinPrice;
      asset.quantity = receivedAmount;
      asset.account = account;

      await queryRunner.manager.save(Asset, asset);
    } catch (e) {
      console.log(e);
    }
  }
}
