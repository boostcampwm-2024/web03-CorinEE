import { DataSource, Repository } from 'typeorm';
import { Asset } from './asset.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AssetRepository extends Repository<Asset> {
  constructor(private dataSource: DataSource) {
    super(Asset, dataSource.createEntityManager());
  }
}
