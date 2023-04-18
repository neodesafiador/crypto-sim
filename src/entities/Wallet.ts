import { Entity, Column, ManyToOne, Relation, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { CryptoCurrency } from './CryptoCurrency';

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

  @ManyToOne(() => CryptoCurrency, (crypto) => crypto.wallet, { cascade: ['insert', 'update'] })
  crypto: Relation<CryptoCurrency>;
}
