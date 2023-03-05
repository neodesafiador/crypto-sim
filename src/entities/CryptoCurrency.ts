import { Entity, Column } from 'typeorm';

@Entity()
export class CryptoCurrency {
  @Column({ unique: true })
  type: string;

  @Column({ unique: true })
  value: number;

  @Column({ unique: true })
  preValue: number;
}
