import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { Operation } from './trans.entity';

@Entity()
export class TransactionLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userEmail: string;

  @Column()
  userName: string;

  @Column()
  operation: Operation;

  @Column()
  message: string;

  @Column('jsonb')
  metadata: Record<string, unknown>;

  @Column()
  transactionId: number;

  @CreateDateColumn()
  createdAt: Date;
}
