import { User } from 'src/auth/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Trade {
  @PrimaryGeneratedColumn()
  tradeId: number;

  @Column()
  assetName: string;

  @Column()
  tradeType: string;

  @Column()
  tradeCurrency: string;

  @Column('double')
  price: number;

  @Column()
  quantity: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.trades)
  user: User;
}
