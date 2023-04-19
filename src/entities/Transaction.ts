import { Entity, Column, ManyToOne, Relation, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { CryptoCurrency } from './CryptoCurrency';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  transactionId: string;

  @Column({ nullable: true })
  price: number;

  @Column()
  amount: number;

  @Column({ nullable: true })
  boughtOn: Date;

  @Column({ nullable: true })
  soldOn: Date;

  @ManyToOne(() => User, (user) => user.transactions, { cascade: ['insert', 'update'] })
  user: Relation<User>;

  @ManyToOne(() => CryptoCurrency, (crypto) => crypto.transactions)
  crypto: Relation<CryptoCurrency>;
}
