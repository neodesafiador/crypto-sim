import { Entity, Column } from 'typeorm';
// import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  // @PrimaryGeneratedColumn('uuid')
  // userId: string;

  @Column({ unique: true })
  email: string;

  // @Column({ unique: true })
  // firstName: string;

  // @Column({ unique: true })
  // lastName: string;

  @Column({ unique: true })
  passwordHash: string;

  @Column({ default: false })
  verifiedEmail: boolean;

  // @Column({ unique: true })
  // money: number;

  // @Column({ unique: true })
  // profit: number;

  // @Column({ unique: true })
  // loss: number;
}
