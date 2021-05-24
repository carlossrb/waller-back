/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity, Operation, TransactionEntity, TransactionLogEntity } from './entities';
import { differenceInCalendarDays, format } from 'date-fns';

@Injectable()
export class TransService {
  //taxa de rendimento mensal
  private monthlyYieldRate = 0.03;
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transRepo: Repository<TransactionEntity>,

    @InjectRepository(AccountEntity)
    private readonly accountRepo: Repository<AccountEntity>,

    @InjectRepository(TransactionLogEntity)
    private readonly logRepo: Repository<TransactionLogEntity>
  ) {}

  private getAccountTotalWithYieldRate = (initialDate: string, initialValue: number, i: number): number => {
    const dateNow = new Date();
    const n = differenceInCalendarDays(new Date(initialDate), dateNow);

    return initialValue + Math.pow(1 + i, n);
  };

  /**
   * Obtem os valores de entrada e saída da conta
   * @param id id da conta
   * @returns
   */
  async getBalance(id: string): Promise<AccountEntity> {
    const acc = await this.accountRepo.findOne({
      where: {
        id,
      },
      relations: ['transactions'],
    });

    if (!acc) {
      throw new NotFoundException('Account not found');
    }

    //Valor total retirado da conta
    const totalWithdrawn = acc.transactions
      .filter((val) => val.status !== Operation.DEPOSIT)
      .reduce((sum, val) => sum + val.amount, 0);

    //caso haja retirada, o valor total retirado é parcelado e descontado de cada deposito feito
    const total = acc.transactions.filter((val) => val.status === Operation.DEPOSIT).length;
    const parcel = totalWithdrawn / (total > 0 ? total : 1);

    //valor total sem taxas
    const accountTotalNoYieldRate = acc.transactions
      .filter((val) => val.status === Operation.DEPOSIT)
      .reduce((sum, val) => sum + val.amount, 0);

    //valor das transações (recebido)
    const accountTotal = acc.transactions
      .filter((val) => val.status === Operation.DEPOSIT)
      .reduce(
        (sum, val) =>
          sum + this.getAccountTotalWithYieldRate(val.operationDate, val.amount - parcel, val.yieldRate / 30),
        0
      );

    await this.accountRepo.update(acc.id, { accountTotal, accountTotalNoYieldRate, totalWithdrawn });

    return (await this.accountRepo.findOne(acc.id))!;
  }

  /**
   * Realiza uma retirada
   * @param id
   * @param amount
   * @returns
   */
  async makeWithdrawal(id: string, amount: string): Promise<AccountEntity> {
    //TODO: idealmente verificar se é o usuário que esta fazendo o resgate (autentication/auth)
    const acc = await this.accountRepo.findOne(id);

    if (!acc) {
      throw new NotFoundException('Account not found');
    }

    const trans = await this.transRepo.save({
      account: acc,
      amount: parseFloat(amount.replace(',', '.')),
      operationDate: format(new Date(), 'MM-dd-yyyy'),
      status: Operation.WITHDRAW,
      yieldRate: this.monthlyYieldRate,
    });

    await this.logRepo.save({
      operation: Operation.WITHDRAW,
      transactionId: trans.id,
      userEmail: acc.userEmail,
      userName: acc.userName,
      metadata: { amount },
    });

    return (await this.accountRepo.findOne(acc.id))!;
  }

  /**
   * Realzia um depósito
   * @param id
   * @param amount
   * @returns
   */
  async makeDeposit(id: string, amount: string): Promise<AccountEntity> {
    //TODO: idealmente verificar se é o usuário que esta fazendo o resgate (autentication/auth)
    const acc = await this.accountRepo.findOne(id);

    if (!acc) {
      throw new NotFoundException('Account not found');
    }

    const trans = await this.transRepo.save({
      account: acc,
      amount: parseFloat(amount.replace(',', '.')),
      operationDate: format(new Date(), 'MM-dd-yyyy'),
      status: Operation.DEPOSIT,
      yieldRate: this.monthlyYieldRate,
    });

    await this.logRepo.save({
      operation: Operation.DEPOSIT,
      transactionId: trans.id,
      userEmail: acc.userEmail,
      userName: acc.userName,
      metadata: { amount },
    });

    return (await this.accountRepo.findOne(acc.id))!;
  }

  /**
   * Faz um pagamento para uma conta
   * @param id
   * @param target conta destino
   * @param amount
   * @returns
   */
  async makePayment(id: string, target: string, amount: string): Promise<AccountEntity> {
    //TODO: idealmente verificar se é o usuário que esta fazendo o resgate (autentication/auth)
    const acc = await this.accountRepo.findOne(id);

    if (!acc) {
      throw new NotFoundException('Account not found');
    }

    const trans = await this.transRepo.save({
      account: acc,
      amount: parseFloat(amount.replace(',', '.')),
      operationDate: format(new Date(), 'MM-dd-yyyy'),
      status: Operation.PAYMENT,
      yieldRate: this.monthlyYieldRate,
      destinationAccount: target.replace(/[^\w\s]/gi, ''),
    });

    await this.logRepo.save({
      operation: Operation.PAYMENT,
      transactionId: trans.id,
      userEmail: acc.userEmail,
      userName: acc.userName,
      metadata: { amount, destinationAccount: target.replace(/[^\w\s]/gi, '') },
    });

    return (await this.accountRepo.findOne(acc.id))!;
  }
}
