import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  OneToOne,
} from 'typeorm';
import { Account } from 'src/account/account.entity';
import { Trade } from 'src/trade/trade.entity';
import { TradeHistory } from 'src/trade-history/trade-history.entity';
import { Favorite } from '@src/favorite/favorite.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isGuest: boolean;

  @Column()
  username: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  provider: string;
	
  @Column({ nullable: true })
  providerId: string;

  @OneToOne(() => Account, (account) => account.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  account: Account;

  @OneToMany(() => Trade, (trade) => trade.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  trades: Trade[];

  @OneToMany(() => TradeHistory, (tradeHistory) => tradeHistory.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  tradeHistories: TradeHistory[];

  @OneToMany(() => Favorite, (favorite) => favorite.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  favorites: Favorite[];
}
