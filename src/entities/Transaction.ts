import { Entity, Column, ManyToOne, Relation, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { CryptoCurrency } from './CryptoCurrency';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  transactionId: string;

  @Column({ default: 0, nullable: true })
  amount: number;

  @Column({ nullable: true })
  boughtOn: Date;

  @Column({ nullable: true })
  soldOn: Date;

  @ManyToOne(() => User, (user) => user.transactions, { cascade: ['insert', 'update'] })
  user: Relation<User>;

  @ManyToOne(() => CryptoCurrency, (cryptocurrency) => cryptocurrency.transactions)
  cryptocurrency: Relation<CryptoCurrency>;
}
