import { DataSource, Repository } from 'typeorm';
import { Favorite } from './favorite.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FavoriteRepository extends Repository<Favorite> {
  constructor(private dataSource: DataSource) {
    super(Favorite, dataSource.createEntityManager());
  }
}
