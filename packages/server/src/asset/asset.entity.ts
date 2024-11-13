import { Account } from 'src/account/account.entity';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Asset {
  @PrimaryGeneratedColumn()
  assetId: number;

  @Column()
  assetName: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  quantity: number;

  @Column({ type: 'timestamp' })
  created: Date;

  @ManyToOne(() => Account, account => account.assets)
  @JoinColumn()
  account: Account;
}
