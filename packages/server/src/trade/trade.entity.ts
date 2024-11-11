import { User } from 'src/auth/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Trade {
  @PrimaryGeneratedColumn()
  tradeId: number;

  @Column()
  assetName: string;

  @Column()
  tradeType: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  quantity: number;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => User, user => user.trades)
  user: User;
}
