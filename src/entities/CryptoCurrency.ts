import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class CryptoCurrency {
  @PrimaryGeneratedColumn()
  crypyoType: string;

  @Column({ unique: true })
  value: number;

  @Column({ unique: true })
  preValue: number;
}
