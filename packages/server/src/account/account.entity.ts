import { Asset } from 'src/asset/asset.entity';
import { User } from 'src/auth/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  accountId: number;

  @Column()
  balance: number;

  @ManyToOne(() => User, user => user.account)
  user: User;

  @OneToMany(() => Asset, asset => asset.account)
  assets: Asset[];
}
