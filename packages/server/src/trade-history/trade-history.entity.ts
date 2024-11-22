import { User } from '@src/auth/user.entity';
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity()
export class TradeHistory {
	@PrimaryGeneratedColumn()
	tradeHistoryId: number;

	@Column()
	assetName: string;

	@Column()
	tradeType: string;

	@Column()
	tradeCurrency: string;

	@Column('double')
	price: number;

	@Column('double')
	quantity: number;

	@Column({ type: 'timestamp' })
	createdAt: Date;

	@CreateDateColumn({ type: 'timestamp' })
	tradeDate: Date;

	@ManyToOne(() => User, (user) => user.tradeHistories, {
		onDelete: 'CASCADE',
	})
	user: User;
}
