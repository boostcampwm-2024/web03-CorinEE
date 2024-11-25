import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { AccountRepository } from './account.repository';
import { User } from 'src/auth/user.entity';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AssetRepository } from '@src/asset/asset.repository';
@Module({
  imports: [TypeOrmModule.forFeature([Account, User])],
  controllers: [AccountController],
  providers: [AccountRepository, AccountService, AssetRepository],
})
export class AccountModule {}
