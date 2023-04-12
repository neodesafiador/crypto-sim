import { Entity, Column, OneToOne, ManyToOne, Relation, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { CryptoCurrency } from './CryptoCurrency';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  walletId: string;

  // @Column()
  // userId: string;

  // @Column()
  // cryptoId: string;

  // @Column({ unique: true })
  // address: string;

  // @Column()
  // privateKey: string;

  @Column()
  amount: number;

  @Column()
  boughtOn: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  profit: number;

  @ManyToOne(() => User, (user) => user.wallets, { cascade: ['insert', 'update'] })
  user: Relation<User>;

  @OneToOne(() => CryptoCurrency, (currency) => currency.wallet, { cascade: ['insert', 'update'] })
  currency: CryptoCurrency[];
}
