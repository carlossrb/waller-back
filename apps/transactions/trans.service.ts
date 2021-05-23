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

    //Valor total retirado da conta
    const totalWithdrawn = acc.transactions
      .filter((val) => val.status !== 'DEPOSIT')
      .reduce((sum, val) => sum + val.amount, 0);

    //caso haja retirada, o valor total retirado é parcelado e descontado de cada deposito feito
    const total = acc.transactions.filter((val) => val.status == 'DEPOSIT').length;
    const parcel = totalWithdrawn / (total > 0 ? total : 1);

    //valor total sem taxas
    const accountTotalNoYieldRate = acc.transactions
      .filter((val) => val.status == 'DEPOSIT')
      .reduce((sum, val) => sum + val.amount, 0);

    //valor das transações (recebido)
    const accountTotal = acc.transactions
      .filter((val) => val.status == 'DEPOSIT')
      .reduce(
        (sum, val) =>
          sum + this.getAccountTotalWithYieldRate(val.operationDate, val.amount - parcel, val.yieldRate / 30),
        0
      );

    await this.accountRepo.update(acc.id, { accountTotal, accountTotalNoYieldRate, totalWithdrawn });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await this.accountRepo.findOne(acc.id))!;
  }
}
