/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BadRequestException } from '@nestjs/common';
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { config } from 'src/config';
import { Ctx } from '../../context';
import { createSdk, TransSdk } from 'apps/transactions/sdk';

export class Transactions extends DataSource<Ctx> {
  sdk!: TransSdk;

  initialize({ context }: DataSourceConfig<Ctx>) {
    this.sdk = createSdk({
      url: config.TRANSACTIONS_SERVICE_URL,
    });
  }

  async getAccountBalance(id: string) {
    const trans = await this.sdk.getAccountBalance(id);
    return {
      trans: {
        ...trans,
        id: String(trans.id),
      },
    };
  }
}
