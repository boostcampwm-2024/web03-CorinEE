import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  Unique,
} from 'typeorm';

import { User } from '@src/auth/user.entity';

@Entity()
@Unique(['assetName', 'user'])
export class Favorite extends BaseEntity {
 @PrimaryGeneratedColumn()
 id: number;

 @Column()
 assetName: string;

 @ManyToOne(() => User, (user) => user.favorites, {
   nullable: true,
   onDelete: 'CASCADE',
 })
 @JoinColumn()
 user: User;
}
