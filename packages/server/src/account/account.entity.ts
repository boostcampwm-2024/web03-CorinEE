import { Asset } from 'src/asset/asset.entity';
import { User } from 'src/auth/user.entity';
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
	accountId: string;

	@Column()
	KRW: number;

	@Column()
	USDT: number;

	@OneToOne(() => User, (user) => user.account, { onDelete: 'CASCADE' })
	@JoinColumn()
	user: User;

	@OneToMany(() => Asset, (asset) => asset.account, {
		cascade: true,
		onDelete: 'CASCADE',
	})
	assets: Asset[];
}
