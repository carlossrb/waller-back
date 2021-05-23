import { AccountEntity as Account } from '.';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';

export enum Operation {
  DEPOSIT = 'DEPOSIT',
  PAYMENT = 'PAYMENT',
  WITHDRAW = 'WITHDRAW',
}

@Entity()
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userEmail: string;

  @Column()
  userName: string;

  @Column()
  accountNumber: string;

  @Column()
  status: Operation;

  @Column('date')
  operationDate!: string;

  @Column('float')
  amount: number;

  @Column('float')
  yieldRate: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Account, (acc) => acc.transactions)
  account: Account;
}
