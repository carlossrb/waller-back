import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity, TransactionEntity, TransactionLogEntity } from './entities';
import { differenceInCalendarDays } from 'date-fns';

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
   * @param id
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

    //valor total sem taxas
    const accountTotalNoYieldRate = acc.firstDeposit + acc.transactions.reduce((sum, val) => sum + val.amount, 0);

    //valor inicial de deposito
    let accountTotal = this.getAccountTotalWithYieldRate(
      acc.operationDate,
      acc.firstDeposit,
      acc.monthlyFirstYieldRate / 30
    );

    //valor das transações (recebido)
    accountTotal += acc.transactions
      .filter((val) => val.status == 'DEPOSIT')
      .reduce((sum, val) => sum + this.getAccountTotalWithYieldRate(val.operationDate, val.amount, val.yieldRate), 0);

    //Valor total retirado da conta
    const totalWithdrawn = acc.transactions
      .filter((val) => val.status !== 'DEPOSIT')
      .reduce((sum, val) => sum + val.amount, 0);

    await this.accountRepo.update(acc.id, { accountTotal, accountTotalNoYieldRate, totalWithdrawn });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await this.accountRepo.findOne(acc.id))!;
  }
}
