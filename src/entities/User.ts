import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Relation } from 'typeorm';
import { Transaction } from './Transaction';
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

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 1000 })
  balance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 1000 })
  prevBalance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  profit: number;

  @OneToMany(() => Transaction, (transaction) => transaction.user, {
    cascade: ['insert', 'update'],
  })
  transactions: Relation<Transaction>[];

  @OneToMany(() => CryptoCurrency, (cryptocurrency) => cryptocurrency.user, {
    cascade: ['insert', 'update'],
  })
  cryptoCurrencies: Relation<CryptoCurrency>[];
}
