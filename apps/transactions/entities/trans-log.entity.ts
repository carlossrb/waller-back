import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

type TransactionLogOperation = 'deposit' | 'payment' | 'withdraw';

@Entity()
export class TransactionLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userEmail: string;

  @Column()
  userName: string;

  @Column()
  operation: TransactionLogOperation;

  @Column()
  message: string;

  @Column('jsonb')
  metadata: Record<string, unknown>;

  @Column()
  transactionId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
