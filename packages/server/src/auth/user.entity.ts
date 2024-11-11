import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique, OneToOne } from "typeorm";
import { Account } from "src/account/account.entity";
import { Trade } from "src/trade/trade.entity";
import { TradeHistory } from "src/trade-history/trade-history.entity";

@Entity()
@Unique(['username'])
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @OneToOne(() => Account, account => account.user)
  account: Account;

  @OneToMany(() => Trade, trade => trade.user)
  trades: Trade[];

  @OneToMany(() => TradeHistory, tradeHistory => tradeHistory.user)
  tradeHistories: TradeHistory[];
}