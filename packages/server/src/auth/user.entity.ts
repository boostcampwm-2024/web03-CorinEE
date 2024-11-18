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

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isGuest: boolean;

  @Column()
  username: string;

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
}
