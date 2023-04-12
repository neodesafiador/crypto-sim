import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Relation } from 'typeorm';
import { Wallet } from './Wallet';

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
}
