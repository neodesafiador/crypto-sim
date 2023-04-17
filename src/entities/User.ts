import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  Relation,
} from 'typeorm';
import { Wallet } from './Wallet';
import { CryptoCurrency } from './CryptoCurrency';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  passwordHash: string;

  @Column({ default: false })
  verifiedEmail: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 100 })
  balance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 100 })
  prevBalance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  profit: number;

  @OneToMany(() => Wallet, (wallet) => wallet.user, { cascade: ['insert', 'update'] })
  wallets: Relation<Wallet>[];

  @ManyToMany(() => CryptoCurrency, (crypto) => crypto.users, { cascade: ['insert', 'update'] })
  @JoinTable()
  cryptos: Relation<CryptoCurrency>[];
}
