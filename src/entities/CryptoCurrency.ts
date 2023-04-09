import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Relation } from 'typeorm';
import { User } from './User';

@Entity()
export class CryptoCurrency {
  @PrimaryGeneratedColumn()
  cryptoType: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 100 })
  value: number;

  // @Column({ unique: true })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 100 })
  preValue: number;

  @Column()
  boughtOn: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  quantity: number;

  @ManyToOne(() => User, (user) => user.currencies, { cascade: ['insert', 'update'] })
  user: Relation<User>;
}
