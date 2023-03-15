import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Relation } from 'typeorm';
import { User } from './User';

@Entity()
export class CryptoCurrency {
  @PrimaryGeneratedColumn()
  cryptoType: string;

  @Column({ unique: true })
  value: number;

  @Column({ unique: true })
  preValue: number;

  @Column()
  boughtOn: Date;

  @ManyToOne(() => User, (user) => user.currencies, { cascade: ['insert', 'update'] })
  user: Relation<User>;
}
