import { Entity, PrimaryColumn, Column } from 'typeorm';

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
}
