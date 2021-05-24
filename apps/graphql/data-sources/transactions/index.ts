/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BadRequestException } from '@nestjs/common';
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { config } from 'src/config';
import { Ctx } from '../../context';
import { createSdk, TransSdk } from 'apps/transactions/sdk';

//TODO: fazer func para convert ids
export class Transactions extends DataSource<Ctx> {
  sdk!: TransSdk;

  initialize({ context }: DataSourceConfig<Ctx>) {
    this.sdk = createSdk({
      url: config.TRANSACTIONS_SERVICE_URL,
    });
  }

  async getAccountBalance(id: string) {
    const acc = await this.sdk.getAccountBalance(id);
    return {
      ...acc,
      id: String(acc.id),
    };
  }

  async makeDeposit(input: { id: string; amount: string }) {
    const { amount, id } = input;
    const acc = await this.sdk.makeDeposit(id, { amount });
    return {
      ...acc,
      id: String(acc.id),
    };
  }

  async makeWithdrawal(input: { id: string; amount: string }) {
    const { amount, id } = input;
    const acc = await this.sdk.makeWithdrawal(id, { amount });
    return {
      ...acc,
      id: String(acc.id),
    };
  }

  async makePayment(input: { id: string; amount: string; target: string }) {
    const { amount, id, target } = input;
    const acc = await this.sdk.makePayment(id, { amount, target });
    return {
      ...acc,
      id: String(acc.id),
    };
  }
}
