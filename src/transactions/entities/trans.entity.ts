import { AccountEntity as Account } from 'src/account/entities';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

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
  taxes: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Account, (acc) => acc.transactions)
  account: Account;
}