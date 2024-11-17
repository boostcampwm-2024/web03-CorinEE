import { User } from 'src/auth/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class TradeHistory {
  @PrimaryGeneratedColumn()
  tradeHistoryId: number;

  @Column()
  assetName: string;

  @Column()
  tradeType: string;

  @Column('double') 
  price: number;

  @Column()
  quantity: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  tradeDate: Date;

  @ManyToOne(() => User, user => user.tradeHistories)
  user: User;
}
