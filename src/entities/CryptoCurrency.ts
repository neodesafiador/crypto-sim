import { Entity, PrimaryColumn, Column, ManyToOne, Relation, OneToOne } from 'typeorm';
import { User } from './User';
import { Wallet } from './Wallet';

@Entity()
export class CryptoCurrency {
  @PrimaryColumn()
  cryptoType: string;

  // @Column({ unique: true })
  // @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Column()
  value: number;

  // @Column({ unique: true })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  preValue: number;

  @Column()
  boughtOn: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  quantity: number;

  @ManyToOne(() => User, (user) => user.currencies, { cascade: ['insert', 'update'] })
  user: Relation<User>;

  @OneToOne(() => Wallet, (wallet) => wallet.currency, { cascade: ['insert', 'update'] })
  wallet: Wallet[];
}
