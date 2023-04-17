import { Entity, PrimaryColumn, OneToMany, ManyToMany, Column, Relation } from 'typeorm';
import { Wallet } from './Wallet';
import { User } from './User';

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

  @OneToMany(() => Wallet, (wallet) => wallet.crypto, { cascade: ['insert', 'update'] })
  wallet: Relation<Wallet>[];

  @ManyToMany(() => User, (user) => user.cryptos, { cascade: ['insert', 'update'] })
  users: Relation<User>[];
}
