import { Asset } from '@src/asset/asset.entity';
import { User } from '@src/auth/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('double')
  KRW: number;

  @Column('double')
  USDT: number;

  @Column('double')
  BTC: number;

  @OneToOne(() => User, (user) => user.account, {
		nullable: true,
		onDelete: 'CASCADE',
	})
	@JoinColumn()
  user: User;

  @OneToMany(() => Asset, (asset) => asset.account, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  assets: Asset[];
}
