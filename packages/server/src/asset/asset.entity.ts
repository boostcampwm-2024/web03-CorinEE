import { Account } from 'src/account/account.entity';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, CreateDateColumn } from 'typeorm';

@Entity()
export class Asset {
  @PrimaryGeneratedColumn()
  assetId: number;

  @Column()
  assetName: string;

  @Column('double') 
  price: number;

  @Column()
  quantity: number;

  @CreateDateColumn({ type: 'timestamp' })
  created: Date;

  @ManyToOne(() => Account, account => account.assets, { onDelete: 'CASCADE' })
  @JoinColumn()
  account: Account;
}
