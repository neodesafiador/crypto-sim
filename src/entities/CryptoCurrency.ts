import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, Relation } from 'typeorm';
import { User } from './User';
import { Transaction } from './Transaction';

@Entity()
export class CryptoCurrency {
  @PrimaryColumn()
  cryptoType: string;

  @Column()
  value: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  preValue: number;

  @ManyToOne(() => User, (user) => user.cryptoCurrencies, { cascade: ['insert', 'update'] })
  user: Relation<User>;

  @OneToMany(() => Transaction, (transaction) => transaction.cryptocurrency)
  transactions: Relation<Transaction>[];
}
