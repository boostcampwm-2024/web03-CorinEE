import { Account } from '@src/account/account.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Asset {
  @PrimaryGeneratedColumn()
  assetId: number;

  @Column()
  assetName: string;

  @Column('decimal', { precision: 16, scale: 8 })
  price: number;

  @Column('decimal', { precision: 16, scale: 8 })
  quantity: number;

  @Column('decimal', { precision: 16, scale: 8 })
  availableQuantity: number;

  @CreateDateColumn({ type: 'timestamp' })
  created: Date;

  @ManyToOne(() => Account, (account) => account.assets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  account: Account;
}
 