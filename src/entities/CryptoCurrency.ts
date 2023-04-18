import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, Relation } from 'typeorm';
import { User } from './User';
import { Transaction } from './Transaction';

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

  @ManyToOne(() => User, (user) => user.cryptoCurrencies, { cascade: ['insert', 'update'] })
  user: Relation<User>;

  @OneToMany(() => Transaction, (transaction) => transaction.crypto)
  transactions: Relation<Transaction>[];
}
