import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Relation } from 'typeorm';
import { User } from './User';

@Entity()
export class CryptoCurrency {
  @PrimaryGeneratedColumn('uuid')
  cryptoType: string;

  @Column()
  value: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  preValue: number;

  @Column()
  boughtOn: Date;

  @ManyToOne(() => User, (user) => user.currencies, { cascade: ['insert', 'update'] })
  user: Relation<User>;
}
