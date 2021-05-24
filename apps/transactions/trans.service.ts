/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity, Operation, TransactionEntity, TransactionLogEntity } from './entities';
import { differenceInCalendarDays, format } from 'date-fns';

@Injectable()
export class TransService {
  //taxa de rendimento mensal
  private monthlyYieldRate = 0.003;
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transRepo: Repository<TransactionEntity>,

    @InjectRepository(AccountEntity)
    private readonly accountRepo: Repository<AccountEntity>,

    @InjectRepository(TransactionLogEntity)
    private readonly logRepo: Repository<TransactionLogEntity>
  ) {}

  private getAccountTotalWithYieldRate = (initialDate: string, initialValue: number, i: number): number => {
    const dateNow = new Date(format(new Date(), 'MM-dd-yyyy'));
    const n = differenceInCalendarDays(dateNow, new Date(initialDate)) - 1;
    return initialValue * Math.pow(1 + i, n);
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
    const totalWithdrawal = acc.transactions
      .filter((val) => val.status !== Operation.DEPOSIT)
      .reduce((sum, val) => sum + val.amount, 0);

    //caso haja retirada, o valor total retirado é parcelado e descontado de cada deposito feito (diminui o rendimento final de cada deposito)
    const total = acc.transactions.filter((val) => val.status === Operation.DEPOSIT).length;
    const parcel = totalWithdrawal / (total > 0 ? total : 1);

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

    await this.accountRepo.update(acc.id, {
      accountTotal,
      accountTotalNoYieldRate,
      totalWithdrawal,
      yields: totalWithdrawal + accountTotal - accountTotalNoYieldRate,
    });

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

    if (acc.accountTotal < parseFloat(amount.replace(',', '.'))) {
      throw new NotFoundException('Insufficient funds');
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
      message: `Retirada realizada em ${new Date()}`,
      metadata: { amount },
    });

    return this.getBalance(id);
  }

  /**
   * Realiza um depósito
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
      message: `Depósito realizado em ${new Date()}`,
      metadata: { amount },
    });

    return this.getBalance(id);
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

    if (acc.accountTotal < parseFloat(amount.replace(',', '.'))) {
      throw new NotFoundException('Insufficient funds');
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
      message: `Pagamento realizado em ${new Date()}`,
      metadata: { amount, destinationAccount: target.replace(/[^\w\s]/gi, '') },
    });

    return this.getBalance(id);
  }
}
