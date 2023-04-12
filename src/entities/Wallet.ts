import { Entity, Column, ManyToOne, Relation, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  walletId: string;

  @Column()
  name: string;

  @Column()
  amount: number;

  @Column()
  boughtOn: Date;

  @ManyToOne(() => User, (user) => user.wallets, { cascade: ['insert', 'update'] })
  user: Relation<User>;
}
