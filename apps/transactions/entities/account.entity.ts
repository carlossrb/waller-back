import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { TransactionEntity as Transaction } from '../../transactions/entities';

@Entity()
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userEmail: string;

  @Column()
  userName: string;

  @Column()
  accountNumber: string;

  @Column('date')
  operationDate!: string;

  @Column('float')
  firstDeposit: number;

  @Column('float')
  accountTotal: number;

  @Column('float')
  totalWithdrawn: number;

  @Column('float')
  accountTotalNoYieldRate: number;

  @Column('float')
  monthlyFirstYieldRate: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Transaction, (trans) => trans.account)
  transactions: Transaction[];

  @UpdateDateColumn()
  updatedAt: Date;
}
